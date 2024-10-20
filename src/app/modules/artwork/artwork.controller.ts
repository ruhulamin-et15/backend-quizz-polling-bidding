import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { artworkService } from "./artwork.service";

const createArtwork = catchAsync(async (req: Request, res: Response) => {
  const result = await artworkService.createBiddingIntoDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "artwork created successfully",
    data: result,
  });
});

export const artworkController = {
  createArtwork,
};
