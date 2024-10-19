import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

const createPollIntoDB = async (req: any) => {
  const adminId = req.user.id;
  const { question, options } = req.body;
  const poll = await prisma.polls.create({
    data: {
      adminId,
      question,
      options: {
        create: options.map((option: any) => ({ option: option.option })),
      },
    },
    include: {
      options: true,
    },
  });

  return poll;
};

const submitVoteIntoDB = async (req: any) => {
  const { optionId } = req.params;
  const userId = req.user.id;

  const isExisting = await prisma.votes.findUnique({
    where: {
      optionId: optionId,
      userId: userId,
    },
  });

  if (isExisting) {
    throw new Error("User has already voted for this option");
  }

  const vote = await prisma.votes.create({
    data: {
      optionId,
      userId,
    },
  });

  return vote;
};

const getAllPollingFromDB = async () => {
  const polls = await prisma.polls.findMany({
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });

  if (polls.length === 0) {
    throw new ApiError(404, "Polls not found");
  }

  return polls;
};

const getSinglePollingFromDB = async (pollingId: string) => {
  const poll = await prisma.polls.findUnique({
    where: { id: pollingId },
    include: {
      options: {
        include: {
          votes: true,
        },
      },
    },
  });

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }

  return poll;
};

const deletePollingIntoDB = async (pollingId: string) => {
  const isPoll = await getSinglePollingFromDB(pollingId);
  if (!isPoll) {
    throw new ApiError(404, "Poll not found");
  }

  await prisma.votes.deleteMany({
    where: {
      optionId: {
        in: isPoll.options.map((option) => option.id),
      },
    },
  });

  await prisma.option.deleteMany({
    where: {
      pollId: pollingId,
    },
  });

  await prisma.polls.deleteMany({
    where: { id: pollingId },
  });

  return;
};

export const pollingService = {
  createPollIntoDB,
  submitVoteIntoDB,
  getAllPollingFromDB,
  getSinglePollingFromDB,
  deletePollingIntoDB,
};
