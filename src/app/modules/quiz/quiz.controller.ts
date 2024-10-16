import catchAsync from "../../../shared/catchAsync";
import { quizServices } from "./quiz.service";
import sendResponse from "../../../shared/sendResponse";

//create a new quiz
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

//get quiz by id
const getQuizById = catchAsync(async (req: any, res: any) => {
  const quiz = await quizServices.getQuizByIdFromDB(req.params.quizId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Quiz retrieved successfully",
    data: quiz,
  });
});

//update quiz by id
const updateQuiz = catchAsync(async (req: any, res: any) => {
  const updatedQuiz = await quizServices.updateQuizIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Updated quiz successfully",
    data: updatedQuiz,
  });
});

//delete quiz by id
const deleteQuiz = catchAsync(async (req: any, res: any) => {
  await quizServices.deleteQuizIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deleted quiz successfully",
  });
});

export const quizControllers = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
