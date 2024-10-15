import prisma from "../../../shared/prisma";

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

export const questionServices = {
  createQuestionIntoDB,
};
