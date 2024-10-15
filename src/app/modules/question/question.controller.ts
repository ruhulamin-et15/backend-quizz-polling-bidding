import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { questionServices } from "./question.service";

const createQuestion = catchAsync(async (req: any, res: any) => {
  const question = await questionServices.createQuestionIntoDB(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Question created successfully",
    data: question,
  });
});

export const questionControllers = {
  createQuestion,
};
