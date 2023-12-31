const express = require("express");
const router = express.Router();

const Auth = require("./auth");
const Post = require("./post");

router.use("/auth", Auth);
router.use("/post", Post);
router.get("/ping", async (req, res) => {
  res.status(200).send("pong");
});

module.exports = router;
