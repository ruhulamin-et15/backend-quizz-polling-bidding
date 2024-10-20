import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { artworkService } from "./artwork.service";

const createArtwork = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.createArtworkIntoDB(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "artwork created successfully",
    data: result,
  });
});

const getArtworks = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.getArtworksFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "artworks retrived successfully",
    data: result,
  });
});

const getSingleArtwork = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.getSingleArtworkFromDB(
    req.params.artworkId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "artwork retrived successfully",
    data: result,
  });
});

const updateArtwork = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.updateArtworkIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "artwork updated successfully",
    data: result,
  });
});

const deleteArtwork = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.deleteArtworkIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "artwork deleted successfully",
    data: result,
  });
});

const updateArtworkImage = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.updateArtworkImage(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "artwork image updated successfully",
    data: result,
  });
});

export const artworkController = {
  createArtwork,
  getArtworks,
  getSingleArtwork,
  updateArtwork,
  deleteArtwork,
  updateArtworkImage,
};
