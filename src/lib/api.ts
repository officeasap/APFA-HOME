export type ApiUser = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
};

export type ApiSession = {
  token: string;
  expiresAt: string;
};

export type AuthResponse = {
  user: ApiUser;
  session: ApiSession;
};

export type UpdateCurrentUserInput = {
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
};

export type Subject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subject: Subject;
};

export type Lesson = {
  id: string;
  title: string;
  slug: string;
  content: string;
  position: number;
};

export type SubjectsResponse = {
  subjects: Subject[];
};

export type CoursesResponse = {
  subject: Subject;
  courses: Course[];
};

export type LessonsResponse = {
  course: Course;
  lessons: Lesson[];
};

export type LessonProgress = {
  id: string;
  lessonId: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LessonProgressResponse = {
  lesson: Lesson & {
    courseId: string;
    course: Course;
  };
  progress: LessonProgress | null;
};

export type ScreeningRegistrationInput = {
  fullName: string;
  email: string;
  phone: string;
  ageGroup: "UNDER 15" | "UNDER 16" | "UNDER 17";
  dateOfBirth?: string;
  position?: string;
  guardianName?: string;
};

export type ScreeningRegistration = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  ageGroup: "UNDER_15" | "UNDER_16" | "UNDER_17";
  dateOfBirth: string | null;
  position: string | null;
  guardianName: string | null;
  createdAt: string;
};

export type ScreeningRegistrationResponse = {
  registration: ScreeningRegistration;
};

export type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

export type DonationCryptoWallet = {
  id: string;
  asset: string;
  network: string;
  standard: string;
  address: string;
  enabled: boolean;
};

export type CryptoDonationWalletsResponse = {
  wallets: DonationCryptoWallet[];
};

const API_BASE_URL = (
  import.meta.env["VITE_API_URL"] ?? "http://localhost:4001"
).replace(/\/+$/, "");

const SESSION_TOKEN_KEY = "apfa_session_token";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(
    message: string,
    status: number,
    code: string | null = null,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function getStoredSessionToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(SESSION_TOKEN_KEY);
}

function setStoredSessionToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

function clearStoredSessionToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

export function getSessionToken(): string | null {
  return getStoredSessionToken();
}

export function clearSession(): void {
  clearStoredSessionToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredSessionToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let payload: ApiErrorPayload = {};

    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = {};
    }

    throw new ApiError(
      payload.error?.message ?? "The request could not be completed.",
      response.status,
      payload.error?.code ?? null,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function register(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });

  setStoredSessionToken(result.session.token);

  return result;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  setStoredSessionToken(result.session.token);

  return result;
}

export async function logout(): Promise<void> {
  try {
    await request<void>("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    clearStoredSessionToken();
  }
}

export async function getCurrentUser(): Promise<ApiUser> {
  const result = await request<{ user: ApiUser }>("/api/users/me");

  return result.user;
}

export async function updateCurrentUser(
  input: UpdateCurrentUserInput,
): Promise<ApiUser> {
  const result = await request<{ user: ApiUser }>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return result.user;
}

export async function listSubjects(): Promise<Subject[]> {
  const result = await request<SubjectsResponse>(
    "/api/education/subjects",
  );

  return result.subjects;
}

export async function listCoursesBySubject(
  subjectSlug: string,
): Promise<CoursesResponse> {
  return request<CoursesResponse>(
    `/api/education/subjects/${encodeURIComponent(subjectSlug)}/courses`,
  );
}

export async function listLessonsByCourse(
  courseSlug: string,
): Promise<LessonsResponse> {
  return request<LessonsResponse>(
    `/api/education/courses/${encodeURIComponent(courseSlug)}/lessons`,
  );
}

export async function getLessonProgress(
  lessonId: string,
): Promise<LessonProgressResponse> {
  return request<LessonProgressResponse>(
    `/api/education/lessons/${encodeURIComponent(lessonId)}/progress`,
  );
}

export async function completeLesson(
  lessonId: string,
): Promise<LessonProgressResponse> {
  return request<LessonProgressResponse>(
    `/api/education/lessons/${encodeURIComponent(lessonId)}/progress`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}

export async function listCryptoDonationWallets(): Promise<
  CryptoDonationWalletsResponse
> {
  return request<CryptoDonationWalletsResponse>(
    "/api/donations/crypto",
  );
}

export async function createScreeningRegistration(
  input: ScreeningRegistrationInput,
): Promise<ScreeningRegistrationResponse> {
  return request<ScreeningRegistrationResponse>(
    "/api/screening/registrations",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}