const express = require("express");

const router = express.Router();

const {
  addSip,
  fetchSip,
  processSipTransaction,
  fetchSipTransactions,
} = require("../controllers/sipController");
const authLogin = require("../middleware/authLogin");

router.post("/api/sips", authLogin("investor"), addSip);

router.get("/api/sips/:sipId", authLogin("investor"), fetchSip);

router.post(
  "/api/sips/:sipId/process",
  authLogin("investor"),
  processSipTransaction,
);

router.get(
  "/api/sips/:sipId/transactions",
  authLogin("investor"),
  fetchSipTransactions,
);

module.exports = router;
