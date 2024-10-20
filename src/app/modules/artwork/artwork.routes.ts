import express from "express";
import { artworkController } from "./artwork.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

router.post(
  "/create",
  auth("ARTIST"),
  fileUploader.uploadArtworkImage,
  artworkController.createArtwork
);

export const artworkRouters = router;
