
module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define('Form', {
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answerA: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answerB: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answerC: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  return Form;
};


