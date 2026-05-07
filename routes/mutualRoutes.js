const express = require("express");

const router = express.Router();

const {
  addFund,
  fetchFunds,
  updateNav,
} = require("../controllers/mutualController");
const authLogin = require("../middleware/authLogin");

router.post("/api/funds", authLogin("investor"), addFund);

router.get("/api/funds", authLogin("investor"), fetchFunds);

router.put("/api/funds/:fundId/nav", authLogin("investor"), updateNav);

module.exports = router;
