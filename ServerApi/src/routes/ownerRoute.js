const express = require("express");
const { check } = require('express-validator');
const {signup,login, all, getByid} = require("../controllers/ownerController");

const router =  express.Router();

router.route("/signup").all([
    check('email')
    .isEmail()
    .withMessage('Invalid email address'),
    check('password')
    .isLength({min: 6})
    .withMessage('Password must be at least size of 6')
]).post(signup);
router.route("/login").post(login);
router.route("/").get(all);
router.route("/:id").get(getByid);


module.exports = router;