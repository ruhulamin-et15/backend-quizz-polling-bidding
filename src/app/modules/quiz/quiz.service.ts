import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createQuizIntoDB = async (teacherId: string, payload: any) => {
  const quiz = await prisma.quiz.create({
    data: { ...payload, teacherId },
  });

  return quiz;
};

const getAllQuizzesFromDB = async () => {
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: true,
    },
  });

  if (quizzes.length === 0) {
    throw new ApiError(404, "Quizzes not found");
  }

  return quizzes;
};

const getQuizByIdFromDB = async (quizId: string) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  return quiz;
};

const updateQuizIntoDB = async (req: any) => {
  const quizId = req.params.quizId;

  const existingQuiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!existingQuiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const updateQuiz = await prisma.quiz.update({
    where: { id: quizId },

    data: { ...req.body },
  });

  return updateQuiz;
};

const deleteQuizIntoDB = async (req: any) => {
  const quizId = req.params.quizId;

  const existingQuiz = await prisma.quiz.findUnique({
    where: { id: quizId },
  });

  if (!existingQuiz) {
    throw new ApiError(404, "Quiz not found");
  }

  await prisma.questions.deleteMany({ where: { quizId: quizId } });
  await prisma.quiz.delete({
    where: { id: quizId },
  });

  return;
};

export const quizServices = {
  createQuizIntoDB,
  getAllQuizzesFromDB,
  getQuizByIdFromDB,
  updateQuizIntoDB,
  deleteQuizIntoDB,
};
