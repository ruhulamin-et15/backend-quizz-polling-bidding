import catchAsync from "../../../shared/catchAsync";
import { quizServices } from "./quiz.service";
import sendResponse from "../../../shared/sendResponse";

const createQuiz = catchAsync(async (req: any, res: any) => {
  const teacherId = req.user.id;
  const quiz = await quizServices.createQuizIntoDB(teacherId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: `Quiz created successfully`,
    data: quiz,
  });
});

// Get all quizzes
const getAllQuizzes = catchAsync(async (req: any, res: any) => {
  const quizzes = await quizServices.getAllQuizzesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Quizzes retrieved successfully",
    data: quizzes,
  });
});

export const quizControllers = {
  createQuiz,
  getAllQuizzes,
};
