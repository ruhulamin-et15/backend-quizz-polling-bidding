import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { quizRoutes } from "../modules/quiz/quiz.route";
import { questionRoutes } from "../modules/question/question.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },

  {
    path: "/auth",
    route: authRoutes,
  },

  {
    path: "/quiz",
    route: quizRoutes,
  },

  {
    path: "/question",
    route: questionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
