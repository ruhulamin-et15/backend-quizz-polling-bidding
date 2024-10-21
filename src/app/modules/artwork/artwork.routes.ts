import express from "express";
import { artworkController } from "./artwork.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";

const router = express.Router();

//create artwork
router.post(
  "/create",
  auth("ARTIST"),
  fileUploader.uploadArtworkImage,
  artworkController.createArtwork
);

//get all artworks
router.get("/", auth(), artworkController.getArtworks);

//get single artwork by id
router.get("/:artworkId", auth(), artworkController.getSingleArtwork);

//update artwork by id
router.patch(
  "/:artworkId",
  auth("ADMIN", "ARTIST"),
  artworkController.updateArtwork
);

//delete artwork by id
router.delete(
  "/:artworkId",
  auth("ADMIN", "ARTIST"),
  artworkController.deleteArtwork
);

//update artwork image by id
router.patch(
  "/update-imgurl/:artworkId",
  auth("ADMIN", "ARTIST"),
  fileUploader.uploadArtworkImage,
  artworkController.updateArtworkImage
);

export const artworkRouters = router;
