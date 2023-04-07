const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Poll extends Model {}

Poll.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    owner_id: {
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
    modelName: "poll",
    underscored: true,
    timestamps: false,
  }
);

module.exports = Poll;
