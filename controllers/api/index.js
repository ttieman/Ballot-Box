const router = require('express').Router();
const userRoutes = require('./userRoutes');
const pollRoutes = require('./pollRoutes')

router.use('/poll', pollRoutes);
router.use('/users', userRoutes);


module.exports = router;
