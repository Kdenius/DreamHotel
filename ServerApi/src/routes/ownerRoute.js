const express = require("express");
const {signup,login, all, getByid} = require("../controllers/ownerController");

const router =  express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/").get(all);
router.route("/:id").get(getByid);


module.exports = router;