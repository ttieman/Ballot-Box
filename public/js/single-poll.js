const getPoll = async (id) => {
  //get id from URL and fetch the poll
  const poll_id = window.location.href.split("/").pop();
  const response = await fetch(`/api/poll/${poll_id}`);
  const data = await response.json();

  //extract data from the poll object
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
  // Create a Bootstrap card
  const card = document.createElement("div");
  card.classList.add("card");

  // Create the card body
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create the title element
  const header = document.createElement("h5");
  header.classList.add("card-title");
  header.innerText = title;

  // Create the poll element
  const canvasEl = document.createElement("canvas");

  // Append the title and poll elements to the card body
  cardBody.appendChild(header);
  cardBody.appendChild(canvasEl);

  // Append the card body to the card
  card.appendChild(cardBody);

  // Append the card to the container element
  const container = document.querySelector("#pollContainer");
  container.appendChild(card);

  //chartJS tutorial
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
};
const init = () => {
  getPoll();
};

init();
