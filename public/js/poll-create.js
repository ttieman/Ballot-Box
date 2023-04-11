
const choicesContainer = document.getElementById('choices-container');
const numChoicesInput = document.getElementById('num-choices');


document.getElementById("new-poll-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = document.getElementById("question").value;
  const numChoices = parseInt(document.getElementById("num-choices").value);
  const choicesContainer = document.getElementById("choices-container");

  const answers = [];
  for (let i = 0; i < numChoices; i++) {
    const answerInput = choicesContainer.querySelector(`input[name="choice-${i}"]`);
    if (answerInput) {
      answers.push(answerInput.value);
    }
  }

  const pollData = {
    question,
    answers,
  };

  const response = await fetch("/api/poll/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pollData),
  });

  if (response.ok) {
    console.log("Poll created successfully");
    window.location.href = "/"; // Redirect to home page or any other page
  } else {
    console.log("Error creating poll");
  }
});

function createChoiceInputs(numChoices) {
  choicesContainer.innerHTML = '';
  for (let i = 0; i < numChoices; i++) {
    const choiceLabel = document.createElement('label');
    choiceLabel.innerHTML = `Choice ${i + 1}:`;
    choiceLabel.htmlFor = `choice-${i}`;

    const choiceInput = document.createElement('input');
    choiceInput.type = 'text';
    choiceInput.id = `choice-${i}`;
    choiceInput.name = `choice-${i}`;
    choiceInput.required = true;

    choicesContainer.appendChild(choiceLabel);
    choicesContainer.appendChild(choiceInput);
    choicesContainer.appendChild(document.createElement('br'));
  }
}

numChoicesInput.addEventListener('input', (event) => {
  const numChoices = parseInt(event.target.value, 10);
  if (numChoices > 0) {
    createChoiceInputs(numChoices);
  } else {
    choicesContainer.innerHTML = '';
  }
});
createChoiceInputs(2);

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


