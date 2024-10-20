import config from "../config";

export const generateImageUrl = (file: Express.Multer.File): string => {
  const sanitizedFileName = file.originalname
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `${config.backend_base_url}/uploads/${sanitizedFileName}`;
};
