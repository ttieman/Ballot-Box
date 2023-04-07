const getPolls = async () => {
  const response = await fetch(`/api/polls`);
  const data = await response.json();
  renderPolls(data);
};

const renderPolls = (data) => {
  const container = document.querySelector("#AllpPollsContainer");

  data.forEach((poll) => {
    let selections = [];
    let votes = [];
    let pollquestion = poll.pollquestions;
    pollquestion.forEach((question) => {
      selections.push(question.answerText);
      votes.push(question.users.length);
    });

    const canvasId = `poll-${poll.id}`;
    const canvasEl = document.createElement("canvas");
    canvasEl.setAttribute("id", canvasId);
    container.appendChild(canvasEl);

    new Chart(canvasEl, {
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
  });
};

const getPoll = async (id) => {
  const response = await fetch(`/api/polls${id}`);
  const data = await response.json();
  renderPoll(data);
};

const renderPoll = (data) => {
  const container = document.querySelector("#pollContainer");

  let selections = [];
  let votes = [];
  let pollquestion = data.pollquestions;
  pollquestion.forEach((question) => {
    selections.push(question.answerText);
    votes.push(question.users.length);
  });

  const canvasId = `poll-${data.id}`;
  const canvasEl = document.createElement("canvas");
  canvasEl.setAttribute("id", canvasId);
  container.appendChild(canvasEl);

  new Chart(canvasEl, {
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
  getPolls();
};

init();
