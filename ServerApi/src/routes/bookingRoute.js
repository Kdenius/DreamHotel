const express = require("express");
const {add, all, bookingOnProperty, del, oallbooking} = require("../controllers/bookingController");
const router = express.Router();

router.route("/new").post(add);
router.route("/").get(all);
router.route("/:pid").get(bookingOnProperty);
router.route("/:bid").delete(del);
router.route("/all/:id").get(oallbooking)


module.exports = router;