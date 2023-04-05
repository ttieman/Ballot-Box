const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class PollQuestions extends Model {}

PollQuestions.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answerText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: "pollquestions",
    underscored: true,
    timestamps: false,
  }
);

module.exports = PollQuestions;
