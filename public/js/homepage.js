const getPolls = async () => {
  const response = await fetch(`/api/poll`);
  const data = await response.json();
  renderPolls(data);
};

const renderPolls = (data) => {
  data.forEach((poll) => {
    let selections = [];
    let votes = [];
    let pollquestion = poll.pollquestions;
    pollquestion.forEach((question) => {
      selections.push(question.answerText);
      votes.push(question.users.length);
    });

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

const init = () => {
  getPolls();
};

//init();
