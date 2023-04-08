const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./homeRoutes");
const accountRoutes = require("./accountRoutes");
const singlePollRoutes = require("./singlePollRoutes");
const profileRoutes = require("./profileRoutes");

router.use("/", homeRoutes);
router.use("/account", accountRoutes);
router.use("/api", apiRoutes);
router.use("/poll", singlePollRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
