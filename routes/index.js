const express = require("express");
const router = express.Router();
const Velzy = require("../lib/velzy");

//admin root
router.get("/", (req,res) => {
  res.render("admin")
});




module.exports = router;
