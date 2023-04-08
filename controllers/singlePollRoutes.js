const router = require("express").Router();

router.get("/:id", async (req, res) => {
  try {
    const loggedIn = req.session.loggedIn;
    const user_id = req.session.user_id;

    res.render("single-poll", { loggedIn, user_id });
    // send the JSON response with the data to be used in a fetch request
    // res.status(200).json(polls);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
