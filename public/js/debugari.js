const getPolls = async () => {
  const response = await fetch(`/api/polls`);
  const data = await response.json();
  //renderPolls(data);
  console.log(data);
};

const renderPolls = (data) => {
  //const container = document.querySelector("#AllpPollsContainer");
  //container.empty();

  data.forEach((poll) => {
    let selections = [];
    let data = [];
    console.log(poll);
    // var image = data[i].image;
    // var title = data[i].title;
    // var id = data[i].id;
    // anchorEl = $("<a>");
    // temp = container.append(temp);

    //   new Chart(ctx, {
    //     type: "bar",
    //     data: {
    //       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //       datasets: [
    //         {
    //           label: "# of Votes",
    //           data: [12, 19, 3, 5, 2, 3],
    //           borderWidth: 1,
    //         },
    //       ],
    //     },
    //     options: {
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //         },
    //       },
    //     },
    //   });
  });
};

const init = () => {
  getPolls();
};

init();
