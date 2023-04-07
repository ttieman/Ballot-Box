const router = require("express").Router();
const userRoutes = require("./userRoutes");
const pollRoutes = require("./pollRoutes");

router.use("/users", userRoutes);
router.use("/polls", pollRoutes);

module.exports = router;
