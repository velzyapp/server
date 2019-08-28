const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const credentials = req.body;
  console.log(credentials);
  if (credentials.username == "rob" && credentials.password == "rob") {
    res.send({
      success: true,
    })
  } else {
    res.status(401)
  }
})

module.exports = router;
