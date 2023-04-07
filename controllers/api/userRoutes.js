const router = require("express").Router();
const sequelize = require("../../config/connection");

const { User, Poll, PollQuestions, PollVotes } = require("../../models");

//POST /api/users/signup
//will reroute to /login
router.post("/signup", async (req, res) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      // If the email already exists, return an error
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // If the email doesn't exist, create the user
    const dbUserData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.loggedIn = true;

      // Redirect the user to the login route
      res.redirect("/login");
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

// POST /api/users/login
//will reroute to /
router.post("/login", async (req, res) => {
  //http://localhost:3001/api/users/login
  // Check if the user is already logged in
  if (req.session.logged_in) {
    if (req.headers.accept === "application/json") {
      res.status(400).json({ message: "You are already logged in!" });
    } else {
      res.redirect("/homepage");
    }
    return;
  }

  try {
    // Find user by email
    const userData = await User.findOne({ where: { email: req.body.email } });

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
      req.session.logged_in = true;

      // Check if the request is from Insomnia (Accept header is set to 'application/json')
      if (req.headers.accept === "application/json") {
        res.json({ user: userData, message: "You are now logged in!" });
      } else {
        // Redirect the user to the homepage after successful login
        // res.redirect('/homepage');
        res.json({ user: userData, message: "You are now logged in!" });
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/logout/:id", async (req, res) => {
  //http://localhost:3001/api/users/logout/1
  try {
    const targetUserId = parseInt(req.params.id, 10);

    if (req.session.user_id !== targetUserId) {
      res
        .status(403)
        .json({ message: "You can only log out of your own session" });
      return;
    }

    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).json({ message: "You are now logged out!" }).end();
      });
    } else {
      res.status(404).json({ message: "No session found" }).end();
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

//BELLOW ARE DEBUG ROUTES

//debug route for viewing all users
router.get("/debug", async (req, res) => {
  //http://localhost:3001/api/users/debug
  try {
    const allUsers = await User.findAll();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/debug/open-sessions", async (req, res) => {
  //http://localhost:3001/api/users/debug/open-sessions
  try {
    const sessionCount = await sequelize.models.Session.count(); //get the number of open sessions
    res.status(200).json({ openSessions: sessionCount }); //return the number of open sessions
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/debug/logout-all", async (req, res) => {
  //http://localhost:3001/api/users/debug/logout-all
  try {
    await sequelize.models.Session.destroy({ where: {} });
    res.status(200).json({ message: "All users have been logged out" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//DEBUG ROUTES END

//DEBUG MODELS USING ROUTES FROM ARI
//check who is the owner of all question
router.get("/debugari", async (req, res) => {
  //http://localhost:3001/api/users/debugari
  try {
    const allPoles = await Poll.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });
    res.status(200).json(allPoles);
  } catch (err) {
    res.status(500).json(err);
  }
});

//check all possible answers to a poll
router.get("/debugari/poll/:id", async (req, res) => {
  //http://localhost:3001/api/users/debugari/poll/:id
  try {
    const allPoles = await Poll.findByPk(req.params.id, {
      include: [{ model: PollQuestions }],
    });
    res.status(200).json(allPoles);
  } catch (err) {
    res.status(500).json(err);
  }
});

//check all votes for each answer to a poll
router.get("/debugari/pollQuestions", async (req, res) => {
  //http://localhost:3001/api/users/debugari/pollQuestions
  try {
    const allPoles = await Poll.findAll({
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
    res.render("homepage", logged_in, [charts])
  } catch (err) {
    res.status(500).json(err);
  }
});
//DEBUG MODELS USING ROUTES FROM ARI END

//Export the router
module.exports = router;
