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

const getQuestions = catchAsync(async (req: any, res: any) => {
  const questions = await questionServices.getAllQuestionsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Questions retrieved successfully",
    data: questions,
  });
});

const getSingleQuestion = catchAsync(async (req: any, res: any) => {
  const question = await questionServices.getSingleQuestionsFromDB(
    req.params.questionId
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question retrieved successfully",
    data: question,
  });
});

const updateQuestion = catchAsync(async (req: any, res: any) => {
  const result = await questionServices.updateQuestionIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Question updated successfully",
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req: any, res: any) => {
  await questionServices.deleteQuestionIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Question deleted successfully",
  });
});

export const questionControllers = {
  createQuestion,
  getQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
