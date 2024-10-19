const express = require("express");
const { check } = require('express-validator');
const {signup,login,del, getById, triplist, wishlist, getBooking, getWishlist} = require("../controllers/renterController");
const router = express.Router();

router.route("/signup").all([
    check('email')
    .isEmail()
    .withMessage('Invalid email address'),
    check('password')
    .isLength({min: 6})
    .withMessage('Password must be at least size of 6')
]).post(signup);

router.route("/login").post(login);
router.route("/:id").get(getById);
router.route("/:id").delete(del);
router.route("/wishlist/:rid").get(getWishlist);
router.route("/:action/:rid/:pid").get(wishlist); 
router.route("/trip/:id").get(triplist); 
router.route("/trip/:id/:pid").get(getBooking);



module.exports = router;
