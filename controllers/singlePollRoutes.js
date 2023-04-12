const { fn, col } = require("sequelize");
const router = require("express").Router();
const { Poll, PollQuestions, User } = require("../models");

router.get("/:id", async (req, res) => {
  try {
    const loggedIn = req.session.loggedIn;
    const user_id = req.session.user_id;
    const pollId = req.params.id;

    const pollData = await Poll.findOne({
      where: {
        id: pollId,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: PollQuestions,
          as: "pollquestions",
        },
      ],
    });

    if (!pollData) {
      res.status(404).json({ message: "No poll found with this id" });
      return;
    }

    const poll = pollData.get({ plain: true });

    res.render("single-poll", { poll, loggedIn, user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
