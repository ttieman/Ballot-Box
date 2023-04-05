const router = require("express").Router();
const { User } = require("../../models");

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    // if (await !User.findOne({ where: { email: req.body.email } })) {
    //   await User.create({
    //     email: req.body.email,
    //     password: req.body.password,
    //   });
    //   return;
    // }
    await User.create(req.body);
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    const newUserData = await User.findOne({
      where: { username: req.body.username },
    });

    req.session.save(async () => {
      req.session.user_id = newUserData.id;
      req.session.loggedIn = true;
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    res.json({ message: "You are now logged out!" });
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
