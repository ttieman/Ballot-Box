document.addEventListener("DOMContentLoaded", () => {
  const pollForm = document.getElementById("pollForm");

  pollForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const pollId = pollForm.dataset.pollId;
    const choices = document.getElementsByName("choice");
    let selectedChoice = null;

    for (const choice of choices) {
      if (choice.checked) {
        selectedChoice = choice.value;
        break;
      }
    }

    if (selectedChoice === null) {
      // Do nothing if no choice is selected
      return;
    }

    try {
      const response = await fetch(`/api/poll/vote/${pollId}`, {
        method: "POST",
        body: JSON.stringify({ answerId: selectedChoice }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Handle successful vote submission (e.g., show a message or redirect)
        location.reload(); // Refresh the page after submitting the vote
      } else if (response.status === 409) {
        const data = await response.json();
        console.error(data.message); // Show an alert with the duplicate vote message
        location.reload(); // Refresh the page after showing the alert
      } else {
        // Handle other errors from the server
        console.error("Error submitting the vote.");
      }
    } catch (err) {
      console.error(err);
    }
  });

  const getPoll = async (id) => {
    const poll_id = window.location.href.split("/").pop();
    const response = await fetch(`/api/poll/${id}`);
    const data = await response.json();

    let selections = [];
    let votes = [];
    let title = data.question;
    let pollquestion = data.pollquestions;
    pollquestion.forEach((question) => {
      selections.push(question.answerText);
      votes.push(question.users.length);
    });
    renderPoll(selections, votes, title);
  };

  const renderPoll = (selections, votes, title) => {
    const card = document.createElement("div");
    card.classList.add("card", "d-none");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const header = document.createElement("h5");
    header.classList.add("card-title");
    header.innerText = title;

    const canvasEl = document.createElement("canvas");
    canvasEl.classList.add("d-none");

    cardBody.appendChild(header);
    cardBody.appendChild(canvasEl);
    card.appendChild(cardBody);

    const container = document.querySelector("#pollContainer");
    container.appendChild(card);

    chart = new Chart(canvasEl, {
      type: "bar",
      data: {
        labels: selections,
        datasets: [
          {
            label: "# of Votes",
            data: votes,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const resultsBtn = document.getElementById("resultsBtn");
    resultsBtn.addEventListener("click", function () {
      canvasEl.classList.toggle("d-none");
      card.classList.toggle("d-none");
    });
  };

  const init = () => {
    const pollId = pollForm.dataset.pollId;
    getPoll(pollId);
  };
  init();
});