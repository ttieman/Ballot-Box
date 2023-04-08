const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./homeRoutes");
const accountRoutes = require("./accountRoutes");
const singlePollRoutes = require("./singlePollRoutes");

router.use("/", homeRoutes);
router.use("/account", accountRoutes);
router.use("/api", apiRoutes);
router.use("/poll", singlePollRoutes);

module.exports = router;
