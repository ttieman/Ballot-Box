const router = require('express').Router();
const { User } = require('../../models');

//POST /api/users/signup
//will reroute to /login
router.post('/signup', async (req, res) => {
    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            // If the email already exists, return an error
            res.status(400).json({ message: 'Email already exists' });
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
            res.redirect('/login');
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        res.json({ message: 'You are now logged out!' });
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// POST /api/users/login
//will reroute to /
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { name: req.body.name } });
        if (!userData) {
            res.status(400).json({ message: 'Incorrect name or password, please try again' });
            return;
        }
        const validPassword = await userData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect name or password, please try again' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.json({ user: userData, message: 'You are now logged in!' });
        });
        res.render('homepage', {
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(400).json(err);
    }
});



//debug route for viewing all users
router.get('/debug', async (req, res) => { //http://localhost:3001/api/users/deubg
    try {
        const allUsers = await User.findAll();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;