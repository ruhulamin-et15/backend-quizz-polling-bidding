import config from "../../../config";
import path from "path";
import fs from "fs";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { generateImageUrl } from "../../../helpers/generateUrl";

const createArtworkIntoDB = async (req: any) => {
  const artistId = req.user.id;
  const files = req.file;

  if (!files) {
    throw new ApiError(400, "No image file provided");
  }

  const newImageUrl = generateImageUrl(files);

  const artworkData = req.body?.data ? JSON.parse(req.body.data) : {};

  const artwork = await prisma.artwork.create({
    data: {
      ...artworkData,
      artistId,
      imageUrl: newImageUrl,
    },
  });
  return artwork;
};

const getArtworksFromDB = async () => {
  const artworks = await prisma.artwork.findMany({
    include: {
      artist: true,
    },
  });
  if (artworks.length === 0) {
    throw new ApiError(404, "No artwork found");
  }

  // Sanitize the artist data by removing the password field
  const sanitizedArtworks = artworks.map((artwork: any) => {
    const { password, ...sanitizedArtist } = artwork.artist;
    return {
      ...artwork,
      artist: sanitizedArtist,
    };
  });

  return sanitizedArtworks;
};

const getSingleArtworkFromDB = async (artworkId: string) => {
  const artwork: any = await prisma.artwork.findUnique({
    where: { id: artworkId },
    include: {
      artist: true,
    },
  });
  if (!artwork) {
    throw new ApiError(404, "Artwork not found");
  }

  const { password, otp, otpExpiresAt, ...sanitizedArtist } = artwork.artist;
  return {
    ...artwork,
    artist: sanitizedArtist,
  };
};

const updateArtworkIntoDB = async (req: any) => {
  const updatedArtworkData = req.body;
  const artwork = await getSingleArtworkFromDB(req.params.artworkId);
  if (!artwork) {
    throw new ApiError(404, "Artwork not found");
  }
  const updatedArtwork = await prisma.artwork.update({
    where: { id: req.params.artworkId },
    data: updatedArtworkData,
  });
  return updatedArtwork;
};

const deleteArtworkIntoDB = async (req: any) => {
  const artwork = await getSingleArtworkFromDB(req.params.artworkId);
  if (!artwork) {
    throw new ApiError(404, "Artwork not found");
  }

  if (artwork.imageUrl) {
    const imagePath = path.join(
      process.cwd(),
      artwork.imageUrl.replace(`${config.backend_base_url}`, "")
    );

    fs.unlink(imagePath, (err: any) => {
      if (err) {
        console.error("Error deleting image file:", err);
        throw new ApiError(500, "Failed to delete image file");
      }
    });
  }

  await prisma.artwork.delete({
    where: { id: req.params.artworkId },
  });
  return;
};

const updateArtworkImage = async (req: any) => {
  const files = req.file;

  if (!files) {
    throw new ApiError(400, "No image file provided");
  }
  const artwork = await getSingleArtworkFromDB(req.params.artworkId);
  if (!artwork) {
    throw new ApiError(404, "Artwork not found");
  }

  const newImageUrl = generateImageUrl(files);

  if (artwork.imageUrl) {
    const imagePath = path.join(
      process.cwd(),
      artwork.imageUrl.replace(`${config.backend_base_url}`, "")
    );

    fs.unlink(imagePath, (err: any) => {
      if (err) {
        console.error("Error deleting image file:", err);
        throw new ApiError(500, "Failed to delete image file");
      }
    });
  }

  const updatedArtwork = await prisma.artwork.update({
    where: { id: req.params.artworkId },
    data: { imageUrl: newImageUrl },
  });

  return updatedArtwork;
};

export const artworkService = {
  createArtworkIntoDB,
  getArtworksFromDB,
  getSingleArtworkFromDB,
  updateArtworkIntoDB,
  deleteArtworkIntoDB,
  updateArtworkImage,
};
