import { createClient } from "npm:@supabase/supabase-js@2";
import { scrypt } from "npm:scrypt-js@3.0.1";
import { createHash } from "node:crypto";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase server configuration is incomplete.");
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function hashSessionToken(token: string) {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function createSessionToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function bytesToBase64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    normalized + "=".repeat((4 - normalized.length % 4) % 4);

  return Uint8Array.from(
    atob(padded),
    (char) => char.charCodeAt(0),
  );
}

const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_LENGTH = 64;
const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

async function deriveScrypt(
  password: string,
  salt: Uint8Array,
  keyLength: number,
) {
  return await scrypt(
    new TextEncoder().encode(password),
    salt,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    keyLength,
  );
}

async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(
    new Uint8Array(PASSWORD_SALT_BYTES),
  );

  const derivedKey = await deriveScrypt(
    password,
    salt,
    PASSWORD_KEY_LENGTH,
  );

  return `${bytesToBase64Url(salt)}.${bytesToBase64Url(derivedKey)}`;
}

async function verifyPassword(
  password: string,
  storedHash: string,
) {
  const [encodedSalt, encodedKey] = storedHash.split(".");

  if (!encodedSalt || !encodedKey) {
    return false;
  }

  try {
    const salt = base64UrlToBytes(encodedSalt);
    const expectedKey = base64UrlToBytes(encodedKey);

    if (
      salt.length !== PASSWORD_SALT_BYTES ||
      expectedKey.length === 0
    ) {
      return false;
    }

    const derivedKey = await deriveScrypt(
      password,
      salt,
      expectedKey.length,
    );

    if (derivedKey.length !== expectedKey.length) {
      return false;
    }

    let difference = 0;

    for (let index = 0; index < expectedKey.length; index += 1) {
      difference |= derivedKey[index] ^ expectedKey[index];
    }

    return difference === 0;
  } catch {
    return false;
  }
}

function publicUser(user: Record<string, unknown>) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone,
    avatarUrl: user.avatar_url,
  };
}

async function register(body: Record<string, unknown>) {
  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  const fullName =
    typeof body.fullName === "string"
      ? body.fullName.trim()
      : null;

  if (!email || !email.includes("@") || !password) {
    return json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Valid email and password are required.",
        },
      },
      400,
    );
  }

  const { data: existingUser, error: existingError } =
    await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

  if (existingError) {
    console.error(existingError);
    return json(
      {
        error: {
          code: "DATABASE_ERROR",
          message: "Unable to check account.",
        },
      },
      500,
    );
  }

  if (existingUser) {
    return json(
      {
        error: {
          code: "USER_ALREADY_EXISTS",
          message: "A user with this email already exists.",
        },
      },
      409,
    );
  }

  const passwordHash = await hashPassword(password);

  const { data: user, error: userError } =
    await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
      })
      .select(
        "id,email,full_name,phone,avatar_url",
      )
      .single();

  if (userError || !user) {
    console.error(userError);
    return json(
      {
        error: {
          code: "REGISTRATION_FAILED",
          message: "Unable to create account.",
        },
      },
      500,
    );
  }

  const { error: subscriptionError } =
    await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        status: "ACTIVE",
      });

  if (subscriptionError) {
    console.error(subscriptionError);

    await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    return json(
      {
        error: {
          code: "REGISTRATION_FAILED",
          message: "Unable to initialize account.",
        },
      },
      500,
    );
  }

  const token = createSessionToken();

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_MS,
  ).toISOString();

  const { error: sessionError } =
    await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        token_hash: hashSessionToken(token),
        expires_at: expiresAt,
      });

  if (sessionError) {
    console.error(sessionError);

    await supabase
      .from("subscriptions")
      .delete()
      .eq("user_id", user.id);

    await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    return json(
      {
        error: {
          code: "REGISTRATION_FAILED",
          message: "Unable to create session.",
        },
      },
      500,
    );
  }

  return json(
    {
      user: publicUser(user),
      session: {
        token,
        expiresAt,
      },
    },
    201,
  );
}

async function login(body: Record<string, unknown>) {
  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!email || !password) {
    return json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required.",
        },
      },
      400,
    );
  }

  const { data: user, error } =
    await supabase
      .from("users")
      .select(
        "id,email,password_hash,full_name,phone,avatar_url",
      )
      .eq("email", email)
      .maybeSingle();

  if (error) {
    console.error(error);
    return json(
      {
        error: {
          code: "DATABASE_ERROR",
          message: "Unable to authenticate.",
        },
      },
      500,
    );
  }

  if (!user) {
    return json(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      },
      401,
    );
  }

  const valid = await verifyPassword(
    password,
    user.password_hash,
  );

  if (!valid) {
    return json(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      },
      401,
    );
  }

  const token = createSessionToken();

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_MS,
  ).toISOString();

  const { error: sessionError } =
    await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        token_hash: hashSessionToken(token),
        expires_at: expiresAt,
      });

  if (sessionError) {
    console.error(sessionError);
    return json(
      {
        error: {
          code: "LOGIN_FAILED",
          message: "Unable to create session.",
        },
      },
      500,
    );
  }

  return json({
    user: publicUser(user),
    session: {
      token,
      expiresAt,
    },
  });
}

async function authenticatedUser(token: string) {
  const tokenHash = hashSessionToken(token);

  const { data: session, error: sessionError } =
    await supabase
      .from("sessions")
      .select("id,user_id,expires_at,revoked_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

  if (sessionError || !session) {
    return null;
  }

  if (
    session.revoked_at !== null ||
    new Date(session.expires_at) <= new Date()
  ) {
    return null;
  }

  const { data: user } =
    await supabase
      .from("users")
      .select("id,email,full_name,phone,avatar_url")
      .eq("id", session.user_id)
      .maybeSingle();

  if (!user) {
    return null;
  }

  return {
    session,
    user,
  };
}

async function me(request: Request) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    return json(
      {
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication required.",
        },
      },
      401,
    );
  }

  const [scheme, token] =
    authorization.split(" ");

  if (
    scheme?.toLowerCase() !== "bearer" ||
    !token
  ) {
    return json(
      {
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication required.",
        },
      },
      401,
    );
  }

  const authenticated = await authenticatedUser(token);

  if (!authenticated) {
    return json(
      {
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication required.",
        },
      },
      401,
    );
  }

  return json({
    user: publicUser(authenticated.user),
  });
}

async function logout(request: Request) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const [, token] =
    authorization.split(" ");

  if (token) {
    await supabase
      .from("sessions")
      .update({
        revoked_at: new Date().toISOString(),
      })
      .eq(
        "token_hash",
        hashSessionToken(token),
      )
      .is("revoked_at", null);
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return json(
      {
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Method not allowed.",
        },
      },
      405,
    );
  }

  try {
    const body =
      request.headers
        .get("content-type")
        ?.includes("application/json")
        ? await request.json()
        : {};

    const action =
      new URL(request.url).searchParams.get("action");

    switch (action) {
      case "register":
        return await register(body);

      case "login":
        return await login(body);

      case "me":
        return await me(request);

      case "logout":
        return await logout(request);

      default:
        return json(
          {
            error: {
              code: "UNKNOWN_AUTH_ACTION",
              message: "Unknown authentication action.",
            },
          },
          400,
        );
    }
  } catch (error) {
    console.error(error);

    return json(
      {
        error: {
          code: "AUTH_INTERNAL_ERROR",
          message: "Authentication request failed.",
        },
      },
      500,
    );
  }
});
