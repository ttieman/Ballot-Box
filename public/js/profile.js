const addPostHandler = () => {
  console.log("hello");
  document.querySelector("#addPollContainer").style.display = "block";
  document.querySelector("#pollsContainer").style.display = "none";
  document.querySelector("#addPoll").style.display = "none";
};

const postFormHandler = async (event) => {
  event.preventDefault();
  const title = document.querySelector("#title-poll").value.trim();
  const description = document.querySelector("#description-poll").value.trim();
  const user_id = window.location.href.split("/").pop();

  if (title && description) {
    const response = await fetch("/dashboard", {
      method: "POST",
      body: JSON.stringify({ title, description }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace(`/dashboard/${user_id}`);
    } else {
      alert("Failed to post");
    }
  }
};

document.querySelector("#addPollContainer").style.display = "none";
document.querySelector("#pollsContainer").style.display = "block";
document.querySelector("#addPoll").style.display = "block";

document
  .querySelector(".poll-form")
  .addEventListener("submit", postFormHandler);

document.querySelector("#addPoll").addEventListener("click", addPostHandler);
