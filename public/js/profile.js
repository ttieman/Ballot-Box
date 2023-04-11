const choicesContainer = document.getElementById("choices-container");
const numChoicesInput = document.getElementById("num-choices");
const user_id = window.location.href.split("/").pop();

const deletePostHandler = async (event, button) => {
  event.preventDefault();
  const poll_id = button.dataset.delete;
  const response = await fetch(`/api/poll/delete/${poll_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace(`/profile/${user_id}`);
  } else {
    alert("Failed to delete");
  }
};

const addPostHandler = () => {
  document.querySelector("#addPollContainer").style.display = "block";
  document.querySelector("#pollsContainer").style.display = "none";
  document.querySelector("#addPoll").style.display = "none";
};

document
  .getElementById("new-poll-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = document.getElementById("question").value.trim();
    const numChoices = parseInt(document.getElementById("num-choices").value);
    const choicesContainer = document.getElementById("choices-container");

    const answers = [];
    for (let i = 0; i < numChoices; i++) {
      const answerInput = choicesContainer.querySelector(
        `input[name="choice-${i}"]`
      );
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
      document.location.replace(`/profile/${user_id}`);
    } else {
      alert("Error creating poll");
    }
  });

function createChoiceInputs(numChoices) {
  choicesContainer.innerHTML = "";
  for (let i = 0; i < numChoices; i++) {
    const choiceLabel = document.createElement("label");
    choiceLabel.innerHTML = `Choice ${i + 1}:`;
    choiceLabel.htmlFor = `choice-${i}`;
    choiceLabel.classList.add("input-group-text");

    const choiceInput = document.createElement("input");
    choiceInput.type = "text";
    choiceInput.id = `choice-${i}`;
    choiceInput.name = `choice-${i}`;
    choiceInput.required = true;
    choiceInput.classList.add("form-control");

    const choiceInputGroup = document.createElement("div");
    choiceInputGroup.classList.add("input-group", "mb-3");
    choiceInputGroup.appendChild(choiceLabel);
    choiceInputGroup.appendChild(choiceInput);
    choicesContainer.appendChild(choiceInputGroup);
  }
}

numChoicesInput.addEventListener("input", (event) => {
  const numChoices = parseInt(event.target.value, 10);
  if (numChoices > 0) {
    createChoiceInputs(numChoices);
  } else {
    choicesContainer.innerHTML = "";
  }
});
createChoiceInputs(2);

document.querySelector("#addPollContainer").style.display = "none";
document.querySelector("#pollsContainer").style.display = "block";
document.querySelector("#addPoll").style.display = "block";

document.querySelector("#addPoll").addEventListener("click", addPostHandler);

const deletePollButtons = document.querySelectorAll(".deletePoll");
deletePollButtons.forEach((button) => {
  button.addEventListener("click", (event) => deletePostHandler(event, button));
});
