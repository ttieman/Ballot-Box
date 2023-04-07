const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Poll, PollQuestions, PollVotes, User } = require('../../models');
const { fn, col } = require('sequelize');



router.get("/", async (req, res) => {
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

//check all possible answers to a poll
router.get("/:id", async (req, res) => {
  //http://localhost:3001/api/poll/:id
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



// GET /api/poll/:id
//get single poll by id   http://localhost:3001/api/poll/1
router.get('/:id', async (req, res) => {
    try {
        const pollData = await Poll.findByPk(req.params.id, {
            include: [
                {
                    model: PollQuestions,
                    attributes: ['id', 'poll_id', 'answerText'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            exclude: ['password'],
                        },

                    ]
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
}
);

// POST /api/poll/create to vote on poll only if logged in

router.post('/create', async (req, res) => {
    try {
        // if (req.session.loggedIn) {
        const pollData = await Poll.create({
            question: req.body.question,
            owner_id: 1, // Set owner_id manually for testing purposes
        });

        // Create the poll questions (answer options)
        const answerPromises = req.body.answers.map((answerText) => {
            return PollQuestions.create({
                poll_id: pollData.id,
                answerText: answerText,
            });
        });

        // Wait for all poll questions to be created
        await Promise.all(answerPromises);

        const pollWithAnswers = await Poll.findByPk(pollData.id, {
            include: [
                {
                    model: PollQuestions,
                    attributes: ['id', 'poll_id', 'answerText'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            exclude: ['password'],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(pollWithAnswers);
        // } else {
        //   res.status(400).json({ message: 'You must be logged in to create a poll!' });
        // }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while creating the poll' });
    }
});

// POST /api/poll/:id/vote to vote on poll only if logged in
//the json should looklike this:
// {
//     "answers": [1, 2]
// }
//http://localhost:3001/api/poll/vote/1

router.post('/vote/:id', async (req, res) => {
    try {
        const pollData = await Poll.findByPk(req.params.id, {
            include: [
                {
                    model: PollQuestions,
                    attributes: ['id', 'poll_id', 'answerText'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            exclude: ['password'],
                        },
                    ],
                },
            ],
        });

        const existingVote = await PollVotes.findOne({
            where: {
                pollquestion_id: req.body.answerId,
                user_id: 1, // Set user_id manually for testing purposes
            },
        });

        if (!existingVote) {
            await PollVotes.create({
                pollquestion_id: req.body.answerId,
                user_id: 1, // Set user_id manually for testing purposes
            });
        }

        const pollWithAnswers = await Poll.findByPk(pollData.id, {
            include: [
                {
                    model: PollQuestions,
                    attributes: ['id', 'poll_id', 'answerText'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            exclude: ['password'],
                        },
                    ],
                },
            ],
        });

        res.status(200).json(pollWithAnswers);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while voting on the poll' });
    }
});

router.get('/count/:id', async (req, res) => { //http://localhost:3001/api/poll/count/1
    try {
        const pollData = await Poll.findByPk(req.params.id, {
            include: [
                {
                    model: PollQuestions,
                    attributes: ['id', 'poll_id', 'answerText'],
                    include: [
                        {
                            model: PollVotes,
                            as: 'votes',
                            attributes: ['id', 'user_id']
                        },
                        {
                            model: User,
                            attributes: ['id', 'username'],
                            exclude: ['password'],
                        },
                    ],
                },
            ],
        });

        if (!pollData) {
            res.status(404).json({ message: 'No poll found with that id!' });
            return;
        }

        const pollWithVotesCount = pollData.toJSON();
        pollWithVotesCount.pollquestions.forEach((pollQuestion) => {
            pollQuestion.voteCount = pollQuestion.votes.length;
        });

        res.status(200).json(pollWithVotesCount);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while retrieving the poll data' });
    }
});



module.exports = router;
