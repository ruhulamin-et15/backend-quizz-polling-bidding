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

router.get("/", auth(), artworkController.getArtworks);

router.get("/:artworkId", auth(), artworkController.getSingleArtwork);

router.patch(
  "/:artworkId",
  auth("ADMIN", "ARTIST"),
  artworkController.updateArtwork
);

router.delete(
  "/:artworkId",
  auth("ADMIN", "ARTIST"),
  artworkController.deleteArtwork
);

router.patch(
  "/update-imgurl/:artworkId",
  auth("ADMIN", "ARTIST"),
  fileUploader.uploadArtworkImage,
  artworkController.updateArtworkImage
);

export const artworkRouters = router;
