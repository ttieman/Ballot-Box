const router = require("express").Router();
const sequelize = require("../../config/connection");

const { User, Poll, PollQuestions } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const allPollData = await Poll.findAll({
      attributes: [
        "id",
        "question",
        "date_created",
        "owner_id",
        [sequelize.fn("COUNT", sequelize.col("pollquestions.id")), "votes"],
      ],
      include: [
        {
          model: PollQuestions,
          attributes: ["id", "poll_id", "answerText"],
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

module.exports = router;
