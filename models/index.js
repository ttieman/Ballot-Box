const Poll = require("./Poll");
const User = require("./User");
const PollVotes = require("./PollVotes");
const PollQuestions = require("./PollQuestions");

User.belongsToMany(PollQuestions, {
  through: PollVotes,
  unique: false,
  foreignKey: "user_id",
  otherKey: "pollquestion_id",
});

PollQuestions.belongsToMany(User, {
  through: PollVotes,
  unique: false,
  foreignKey: "pollquestion_id",
  otherKey: "user_id",
});

User.hasMany(Poll, {
  foreignKey: "owner_id",
  onDelete: "CASCADE",
});

Poll.belongsTo(User, {
  foreignKey: "owner_id",
});

Poll.hasMany(PollQuestions, {
  foreignKey: "poll_id",
  onDelete: "CASCADE",
});

PollQuestions.belongsTo(Poll, {
  foreignKey: "poll_id",
});

module.exports = { Poll, User, PollVotes, PollQuestions };
