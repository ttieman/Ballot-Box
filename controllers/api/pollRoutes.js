const router = require("express").Router();
const sequelize = require("../../config/connection");

const { User, Poll, PollQuestions } = require("../../models");

router.get("/", async (req, res) => {
  //http://localhost:3001/api/polls
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

//check all possible answers to a poll
router.get("/:id", async (req, res) => {
  //http://localhost:3001/api/polls/:id
  try {
    const allPoles = await Poll.findByPk(req.params.id, {
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
    res.status(200).json(allPoles);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
