const router = require('express').Router();
const userRoutes = require('./userRoutes');
const pollRoutes = require('./pollRoutes')
// const projectRoutes = require('./projectRoutes');
router.use('/poll', pollRoutes);
router.use('/users', userRoutes);
// router.use('/projects', projectRoutes);


module.exports = router;
