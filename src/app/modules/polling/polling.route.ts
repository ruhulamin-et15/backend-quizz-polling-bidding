import express from "express";
import { pollingController } from "./polling.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create", auth("ADMIN"), pollingController.createPoll);

router.post("/submit-vote/:optionId", auth(), pollingController.submitVote);

router.get("/", auth(), pollingController.getAllPolls);

router.get("/:pollingId", auth(), pollingController.getSinglePoll);

router.delete(
  "/:pollingId",
  auth("ADMIN", "TEACHER"),
  pollingController.deletePoll
);

export const pollingRoutes = router;
