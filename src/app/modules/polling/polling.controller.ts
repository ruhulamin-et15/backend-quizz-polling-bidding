import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { pollingService } from "./polling.service";
import sendResponse from "../../../shared/sendResponse";

const createPoll = catchAsync(async (req: Request, res: Response) => {
  const result = await pollingService.createPollIntoDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "polling successfully created",
    data: result,
  });
});

const submitVote = catchAsync(async (req: Request, res: Response) => {
  const result = await pollingService.submitVoteIntoDB(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "vote successfully submitted",
    data: result,
  });
});

const getAllPolls = catchAsync(async (req: Request, res: Response) => {
  const polls = await pollingService.getAllPollingFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All Pollings Retrived Successfully",
    data: polls,
  });
});

const getSinglePoll = catchAsync(async (req: Request, res: Response) => {
  const poll = await pollingService.getSinglePollingFromDB(
    req.params.pollingId
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Single polling retrived successfully",
    data: poll,
  });
});

const deletePoll = catchAsync(async (req: Request, res: Response) => {
  await pollingService.deletePollingIntoDB(req.params.pollingId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Polling deleted successfully",
    data: null,
  });
});

export const pollingController = {
  createPoll,
  submitVote,
  getAllPolls,
  getSinglePoll,
  deletePoll,
};
