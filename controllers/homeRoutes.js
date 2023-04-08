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

// router.get('/project/:id', async (req, res) => {
//   try {
//     const projectData = await Project.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ['name'],
//         },
//       ],
//     });

//     const project = projectData.get({ plain: true });

//     res.render('project', {
//       ...project,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // Use withAuth middleware to prevent access to route
// router.get('/profile', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Project }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('profile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
