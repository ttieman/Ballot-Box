const sequelize = require("../config/connection");
const { User, Poll, PollVotes, PollQuestions } = require("../models");

const userData = require("./userData.json");
const pollData = require("./pollData.json");
const pollQuestionsData = require("./pollQuestionsData.json");
const pollVotesData = require("./pollVotesData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  console.log("\n----- DATABASE SYNCED -----\n");

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log("\n----- USERS SYNCED -----\n");

  const polls = await Poll.bulkCreate(pollData);
  console.log("\n----- POLLS SYNCED -----\n");

  const pollQuestions = await PollQuestions.bulkCreate(pollQuestionsData);
  console.log("\n----- POLLQUESTIONS SYNCED -----\n");

  const pollVotes = await PollVotes.bulkCreate(pollVotesData);
  console.log("\n----- POLLVOTES SYNCED -----\n");

  process.exit(0);
};

seedDatabase();
