import { createBrowserRouter } from "react-router-dom";

import { RootLayout, NotFound } from "./routes/__root";

import { Home } from "./routes/index";
import { Auth } from "./routes/auth";
import { Coaches } from "./routes/coaches";
import { Contact } from "./routes/contact";
import { CourseDetail } from "./routes/courses.$courseId";
import { Dashboard } from "./routes/dashboard";
import { Donate } from "./routes/donate";
import { Education } from "./routes/education";
import { Events } from "./routes/events";
import { ForgotPassword } from "./routes/forgot-password";
import { Join } from "./routes/join";
import { LessonPage } from "./routes/lessons.$lessonId";
import { Programs } from "./routes/programs";
import { QuizPage } from "./routes/quizzes.$quizId";
import { ResetPassword } from "./routes/reset-password";
import { Screening } from "./routes/screening";
import { Subscription } from "./routes/subscription";
import { Training } from "./routes/training";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "auth", element: <Auth /> },
      { path: "coaches", element: <Coaches /> },
      { path: "contact", element: <Contact /> },
      { path: "courses/:courseId", element: <CourseDetail /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "donate", element: <Donate /> },
      { path: "education", element: <Education /> },
      { path: "events", element: <Events /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "join", element: <Join /> },
      { path: "lessons/:lessonId", element: <LessonPage /> },
      { path: "programs", element: <Programs /> },
      { path: "quizzes/:quizId", element: <QuizPage /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "screening", element: <Screening /> },
      { path: "subscription", element: <Subscription /> },
      { path: "training", element: <Training /> },
    ],
  },
]);