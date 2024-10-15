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

export const quizServices = {
  createQuizIntoDB,
  getAllQuizzesFromDB,
};
