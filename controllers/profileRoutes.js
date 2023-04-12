const router = require("express").Router();
const { Poll } = require("../models");
const withAuth = require("../utils/auth");

//retrieve profile page
router.get("/:user_id", withAuth, async (req, res) => {
  //localhost:3001/profile/
  try {
    const pollData = await Poll.findAll({
      where: { owner_id: req.params.user_id },
    });

    const loggedIn = req.session.loggedIn;
    const user_id = req.session.user_id;

    if (!pollData) {
      res.render("profile", { loggedIn, user_id });
    }

    const polls = pollData.map((poll) => poll.get({ plain: true }));

    res.render("profile", { loggedIn, user_id, polls });
    // res.status(200).render("profile", { polls, loggedIn, user_id });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
