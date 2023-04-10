const router = require("express").Router();
const { Poll, User, PollQuestions } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const allPollData = await Poll.findAll({
      include: [
        { model: User, attributes: { exclude: "password" } },
        { model: PollQuestions },
      ],
    });

    if (!allPollData) {
      res.status(404).json({ message: "no data found" });
    }

    //sending data back to the homepage view
    const polls = allPollData.map((poll) => poll.get({ plain: true }));
    const loggedIn = req.session.loggedIn;
    const user_id = req.session.user_id;

    res.render("mainHomepage", { loggedIn, user_id, polls });
    // send the JSON response with the data to be used in a fetch request
    // res.status(200).json(polls);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET poll create page only if logged in
router.get("/create/poll", async (req, res) => {  //h
  try {
    if (req.session.loggedIn) {
      res.render("poll-create", {
        loggedIn: req.session.loggedIn,
      });
    } else {
      res.render("login");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
