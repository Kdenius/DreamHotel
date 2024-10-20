const express = require("express");
const {add, all, oall, del, update, getByid, availableRoom, changeStatus} = require("../controllers/propertyController");

const router =  express.Router();

router.route("/new").post(add); // for adding new property by owner
router.route("/all/:id").get(oall); // show all property of owner
router.route("/all").get(all); // totally all
router.route("/:id").get(getByid); // get by id
router.route("/:id").delete(del); // delete property
router.route("/:id").patch(update); //update by id
router.route("/:id").post(availableRoom); // return available room
router.route("/:id/:status").get(changeStatus); // change pendig , active, blocked

module.exports = router;