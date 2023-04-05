const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class PollVotes extends Model {}

PollVotes.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pollquestion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        key: "id",
        model: "pollquestions",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        key: "id",
        model: "user",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: "pollvotes",
    underscored: true,
    timestamps: false,
  }
);

module.exports = PollVotes;
