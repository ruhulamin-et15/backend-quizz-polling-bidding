import config from "../../../config";
import prisma from "../../../shared/prisma";

const createBiddingIntoDB = async (req: any) => {
  const artistId = req.user.id;
  const files = req.file;

  const imageUrl = files
    ? `${config.backend_base_url}/uploads/${files.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    : null;

  const artworkData = req.body?.data ? JSON.parse(req.body.data) : {};

  const artwork = await prisma.artwork.create({
    data: {
      ...artworkData,
      artistId,
      imageUrl,
    },
  });

  return artwork;
};

export const artworkService = {
  createBiddingIntoDB,
};
