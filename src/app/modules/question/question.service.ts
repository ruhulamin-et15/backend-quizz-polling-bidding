import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createQuestionIntoDB = async (req: any) => {
  const teacherId = req.user.id;
  const questionData = req.body;
  const question = await prisma.questions.create({
    data: {
      ...questionData,
      teacherId,
    },
  });

  return question;
};

const getAllQuestionsFromDB = async () => {
  const questions = await prisma.questions.findMany();
  if (questions.length === 0) {
    throw new ApiError(404, "Questions not found");
  }
  return questions;
};

const getSingleQuestionsFromDB = async (questionId: string) => {
  const question = await prisma.questions.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    throw new ApiError(404, "Question not found");
  }
  return question;
};

const updateQuestionIntoDB = async (req: any) => {
  const { questionId } = req.params;
  const question = await prisma.questions.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new ApiError(404, "Question not found");
  }
  const updateData = await prisma.questions.update({
    where: { id: questionId },
    data: req.body,
  });

  return updateData;
};

const deleteQuestionIntoDB = async (req: any) => {
  const { questionId } = req.params;
  const question = await prisma.questions.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new ApiError(404, "Question not found");
  }
  await prisma.questions.delete({
    where: { id: questionId },
  });

  return;
};

export const questionServices = {
  createQuestionIntoDB,
  updateQuestionIntoDB,
  deleteQuestionIntoDB,
  getAllQuestionsFromDB,
  getSingleQuestionsFromDB,
};
