const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Poll, PollQuestions, PollVotes, User } = require("../../models");
const { fn, col, Op } = require("sequelize");

router.get("/", async (req, res) => { //get 
  //http://localhost:3001/api/poll
  try {
    const allPollData = await Poll.findAll({
      include: [
        {
          model: PollQuestions,
          include: [
            {
              model: User,
              attributes: {
                exclude: ["password"],
              },
            },
          ],
        },
      ],
    });



    if (!allPollData) {
      res.status(404).json({ message: "no data found" });
    }
    const polls = allPollData.map((poll) => poll.get({ plain: true }));

    res.status(200).json(polls);
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET poll create page only if logged in
router.get("/create/poll", async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.render("createpoll", {
        loggedIn: req.session.loggedIn,
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



// GET /api/poll/:id
//get single poll by id   http://localhost:3001/api/poll/1
router.get("/:id", async (req, res) => {
  try {
    const pollData = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: PollQuestions,
          attributes: ["id", "poll_id", "answerText"],
          include: [
            {
              model: User,
              attributes: ["id", "username"],
              exclude: ["password"],
            },
          ],
        },
      ],
    });
    const poll = pollData.get({ plain: true });
    // res.render('singlepoll', {
    //     poll,
    //     loggedIn: req.session.loggedIn,
    // });
    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/poll/create to vote on poll only if logged in
const formatPollResponse = (poll) => {
  return {
    id: poll.id,
    question: poll.question,
    date_created: poll.date_created,
    owner_id: poll.owner_id,
    pollquestions: poll.pollquestions.map((question) => ({
      id: question.id,
      poll_id: question.poll_id,
      answerText: question.answerText,
      users: question.users,
    })),
  };
};

router.post("/create", async (req, res) => {
  try {
    const pollData = await Poll.create({
      question: req.body.question,
      owner_id: req.session.user_id,
    });

    const answerPromises = req.body.answers.map((answerText) => {
      return PollQuestions.create({
        poll_id: pollData.id,
        answerText: answerText,
      });
    });

    await Promise.all(answerPromises);

    const pollWithAnswers = await Poll.findByPk(pollData.id, {
      include: [
        {
          model: PollQuestions,
          attributes: ["id", "poll_id", "answerText"],
          include: [
            {
              model: User,
              attributes: ["id", "username"],
              exclude: ["password"],
            },
          ],
        },
      ],
    });
    console.log(pollWithAnswers);
    res.status(201).json(formatPollResponse(pollWithAnswers));
    res.render("mainHomepage");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating poll" });
  }
});

// POST /api/poll/:id/vote to vote on poll only if logged in
//the json should looklike this:
// {
//     "answers": [1, 2]
// }
//http://localhost:3001/api/poll/vote/1

router.post("/vote/:id", async (req, res) => {
  try {
    const pollData = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: PollQuestions,
          attributes: ["id", "poll_id", "answerText"],
          include: [
            {
              model: User,
              attributes: ["id", "username"],
              exclude: ["password"],
            },
          ],
        },
      ],
    });

    const pollQuestions = pollData.pollquestions.map((question) => question.id);

    const existingVote = await PollVotes.findOne({
      where: {
        pollquestion_id: { [Op.in]: pollQuestions },
        user_id: req.session.user_id,
      },
    });

    if (existingVote) {
      res.status(409).json({ message: "Duplicate vote prevented" });
    } else {
      await PollVotes.create({
        pollquestion_id: req.body.answerId,
        user_id: req.session.user_id,
      });

      const pollWithAnswers = await Poll.findByPk(pollData.id, {
        include: [
          {
            model: PollQuestions,
            attributes: ["id", "poll_id", "answerText"],
            include: [
              {
                model: User,
                attributes: ["id", "username"],
                exclude: ["password"],
              },
            ],
          },
        ],
      });

      res.status(200).json(pollWithAnswers);
      res.render('single-poll');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while voting on the poll" });
  }
});

router.get("/count/:id", async (req, res) => {
  //http://localhost:3001/api/poll/count/1
  try {
    const pollData = await Poll.findByPk(req.params.id, {
      include: [
        {
          model: PollQuestions,
          attributes: ["id", "poll_id", "answerText"],
          include: [
            {
              model: PollVotes,
              as: "votes",
              attributes: ["id", "user_id"],
            },
            {
              model: User,
              attributes: ["id", "username"],
              exclude: ["password"],
            },
          ],
        },
      ],
    });

    if (!pollData) {
      res.status(404).json({ message: "No poll found with that id!" });
      return;
    } res.status(200).json(pollWithVotesCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while retrieving the poll data" });
  }
});

//delete route to delete a poll by id only for the posts that belong to the logged in user
router.delete("/delete/:id", async (req, res) => {
  //http://localhost:3001/api/poll/delete/:id
  try {
    const pollId = parseInt(req.params.id, 10);
    if (isNaN(pollId)) {
      res.status(400).json({ message: "Invalid poll id" });
      return;
    }

    const pollData = await Poll.destroy({
      where: {
        id: pollId,
        owner_id: req.session.user_id,
      },
    });

    if (!pollData) {
      res.status(404).json({ message: "No poll found with that id!" });
      return;
    }

    res.status(200).json(pollData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting the poll" });
  }
});





module.exports = router;
