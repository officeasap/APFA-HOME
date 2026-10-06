import { supabase } from "./supabase";

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

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"];

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

const SUPABASE_AUTH_FUNCTION_URL =
  `${SUPABASE_URL}/functions/v1/apfa-auth`;

const SUPABASE_EDUCATION_FUNCTION_URL =
  `${SUPABASE_URL}/functions/v1/apfa-education`;

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

function createFunctionHeaders(): Headers {
  const headers = new Headers({
    "content-type": "application/json",
    apikey: SUPABASE_PUBLISHABLE_KEY,
  });

  const token = getStoredSessionToken();

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  return headers;
}

async function parseApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  let payload: ApiErrorPayload = {};

  try {
    payload = (await response.json()) as ApiErrorPayload;
  } catch {
    payload = {};
  }

  return new ApiError(
    payload.error?.message ?? fallbackMessage,
    response.status,
    payload.error?.code ?? null,
  );
}

async function authRequest<T>(
  action: "register" | "login" | "me" | "logout",
  body?: Record<string, unknown>,
): Promise<T> {
  const headers = createFunctionHeaders();

  const response = await fetch(SUPABASE_AUTH_FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      action,
      ...(body ?? {}),
    }),
  });

  if (!response.ok) {
    throw await parseApiError(
      response,
      "The authentication request could not be completed.",
    );
  }

  return (await response.json()) as T;
}

async function educationRequest<T>(
  action:
    | "update_profile"
    | "lesson_progress"
    | "complete_lesson"
    | "screening_registration",
  body?: Record<string, unknown>,
): Promise<T> {
  const token = getStoredSessionToken();

  if (!token) {
    throw new ApiError(
      "You must be signed in to continue.",
      401,
      "AUTH_REQUIRED",
    );
  }

  const headers = createFunctionHeaders();

  const response = await fetch(SUPABASE_EDUCATION_FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      action,
      ...(body ?? {}),
    }),
  });

  if (!response.ok) {
    throw await parseApiError(
      response,
      "The APFA education request could not be completed.",
    );
  }

  return (await response.json()) as T;
}

export async function register(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  const result = await authRequest<AuthResponse>("register", input);

  setStoredSessionToken(result.session.token);

  return result;
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const result = await authRequest<AuthResponse>("login", input);

  setStoredSessionToken(result.session.token);

  return result;
}

export async function logout(): Promise<void> {
  try {
    if (getStoredSessionToken()) {
      await authRequest("logout");
    }
  } finally {
    clearStoredSessionToken();
  }
}

export async function getCurrentUser(): Promise<ApiUser> {
  const result = await authRequest<{ user: ApiUser }>("me");

  return result.user;
}

export async function updateCurrentUser(
  input: UpdateCurrentUserInput,
): Promise<ApiUser> {
  const result = await educationRequest<{ user: ApiUser }>(
    "update_profile",
    input,
  );

  return result.user;
}

export async function listSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from("education_subjects")
    .select(
      `
        id,
        name,
        slug,
        description
      `,
    )
    .order("position", { ascending: true });

  if (error) {
    throw new ApiError(
      error.message,
      500,
      error.code ?? "EDUCATION_SUBJECTS_ERROR",
    );
  }

  return (data ?? []) as Subject[];
}

export async function listCoursesBySubject(
  subjectSlug: string,
): Promise<CoursesResponse> {
  const { data: subject, error: subjectError } = await supabase
    .from("education_subjects")
    .select(
      `
        id,
        name,
        slug,
        description
      `,
    )
    .eq("slug", subjectSlug)
    .maybeSingle();

  if (subjectError) {
    throw new ApiError(
      subjectError.message,
      500,
      subjectError.code ?? "EDUCATION_SUBJECT_ERROR",
    );
  }

  if (!subject) {
    throw new ApiError(
      "The requested subject could not be found.",
      404,
      "SUBJECT_NOT_FOUND",
    );
  }

  const { data: courses, error: coursesError } = await supabase
    .from("education_courses")
    .select(
      `
        id,
        title,
        slug,
        description,
        position
      `,
    )
    .eq("subject_id", subject.id)
    .order("position", { ascending: true });

  if (coursesError) {
    throw new ApiError(
      coursesError.message,
      500,
      coursesError.code ?? "EDUCATION_COURSES_ERROR",
    );
  }

  const normalizedSubject = subject as Subject;

  return {
    subject: normalizedSubject,
    courses: (courses ?? []).map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      subject: normalizedSubject,
    })),
  };
}

export async function listLessonsByCourse(
  courseSlug: string,
): Promise<LessonsResponse> {
  const { data: course, error: courseError } = await supabase
    .from("education_courses")
    .select(
      `
        id,
        title,
        slug,
        description,
        position,
        education_subjects (
          id,
          name,
          slug,
          description
        )
      `,
    )
    .eq("slug", courseSlug)
    .maybeSingle();

  if (courseError) {
    throw new ApiError(
      courseError.message,
      500,
      courseError.code ?? "EDUCATION_COURSE_ERROR",
    );
  }

  if (!course) {
    throw new ApiError(
      "The requested course could not be found.",
      404,
      "COURSE_NOT_FOUND",
    );
  }

  const subject = course.education_subjects as unknown as Subject;

  const { data: lessons, error: lessonsError } = await supabase
    .from("education_lessons")
    .select(
      `
        id,
        title,
        slug,
        content,
        position
      `,
    )
    .eq("course_id", course.id)
    .order("position", { ascending: true });

  if (lessonsError) {
    throw new ApiError(
      lessonsError.message,
      500,
      lessonsError.code ?? "EDUCATION_LESSONS_ERROR",
    );
  }

  const normalizedCourse: Course = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    subject,
  };

  return {
    course: normalizedCourse,
    lessons: (lessons ?? []) as Lesson[],
  };
}

export async function getLessonProgress(
  lessonId: string,
): Promise<LessonProgressResponse> {
  const { data: lesson, error: lessonError } = await supabase
    .from("education_lessons")
    .select(
      `
        id,
        title,
        slug,
        content,
        position,
        course_id,
        education_courses (
          id,
          title,
          slug,
          description,
          position,
          education_subjects (
            id,
            name,
            slug,
            description
          )
        )
      `,
    )
    .eq("id", lessonId)
    .maybeSingle();

  if (lessonError) {
    throw new ApiError(
      lessonError.message,
      500,
      lessonError.code ?? "EDUCATION_LESSON_ERROR",
    );
  }

  if (!lesson) {
    throw new ApiError(
      "The requested lesson could not be found.",
      404,
      "LESSON_NOT_FOUND",
    );
  }

  const course = lesson.education_courses as unknown as {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    position: number;
    education_subjects: Subject;
  };

  const normalizedCourse: Course = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    subject: course.education_subjects,
  };

  return {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      content: lesson.content,
      position: lesson.position,
      courseId: lesson.course_id,
      course: normalizedCourse,
    },
    progress: null,
  };
}

export async function completeLesson(
  lessonId: string,
): Promise<LessonProgressResponse> {
  return educationRequest<LessonProgressResponse>(
    "complete_lesson",
    {
      lessonId,
    },
  );
}

export async function createScreeningRegistration(
  input: ScreeningRegistrationInput,
): Promise<ScreeningRegistrationResponse> {
  return educationRequest<ScreeningRegistrationResponse>(
    "screening_registration",
    input,
  );
}