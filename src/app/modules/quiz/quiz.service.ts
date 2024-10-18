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

const submitQuizIntoDB = async (req: any) => {
  const quizId = req.params.quizId;
  const userId = req.user.id;
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    throw new ApiError(400, "Answers must be an array");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: true,
    },
  });
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const alreadySubmitQuiz = await prisma.quizParticipation.findFirst({
    where: { quizId: quizId, userId: userId },
  });

  if (alreadySubmitQuiz) {
    throw new ApiError(409, "User has already submitted this quiz");
  }

  let score = 0;
  for (const answer of answers) {
    const question = quiz.questions.find((q) => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedOption) {
      score += question.marks;
    }
  }

  const participation = await prisma.quizParticipation.create({
    data: {
      userId,
      quizId,
      score,
      submittedAt: new Date(),
    },
  });

  return participation;
};

export const quizServices = {
  createQuizIntoDB,
  getAllQuizzesFromDB,
  getQuizByIdFromDB,
  updateQuizIntoDB,
  deleteQuizIntoDB,
  submitQuizIntoDB,
};
