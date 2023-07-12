const express = require("express");
const router = express.Router();
const posts = require("./posts");
const users = require("./users.js")
const auth = require("./auth.js")


router.use("", [posts, users, auth]); 


module.exports = router;