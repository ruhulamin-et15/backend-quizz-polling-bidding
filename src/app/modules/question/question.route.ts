import express from "express";
import auth from "../../middlewares/auth";
import { questionControllers } from "./question.controller";

const router = express.Router();

router.post("/create", auth("TEACHER"), questionControllers.createQuestion);

export const questionRoutes = router;
