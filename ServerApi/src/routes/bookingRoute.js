const express = require("express");
const {add, all, bookingOnProperty, del, oallbooking, changeStatus} = require("../controllers/bookingController");
const router = express.Router();

router.route("/new").post(add);
router.route("/:pid").get(bookingOnProperty);
router.route("/:bid").delete(del);
router.route("/all/:id").get(oallbooking)
// router.route("/allr/:id").get(rallbooking)
router.route("/:id/:status").get(changeStatus); 
router.route("/").get(all);


module.exports = router;