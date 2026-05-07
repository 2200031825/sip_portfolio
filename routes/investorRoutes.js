const express = require("express");

const investorRouter = express.Router();

const {
  login,
  logout,
  getInvestor,
  getHoldings,
  getNetworth,
  createInvestor,
} = require("../controllers/investorController");

const authLogin = require("../middleware/authLogin");

investorRouter.post("/add", authLogin("investor"), createInvestor);
investorRouter.post("/login", login);

investorRouter.get("/logout", authLogin("investor"), logout);

investorRouter.get("/:id/holdings", authLogin("investor"), getHoldings);

investorRouter.get("/:id/networth", authLogin("investor"), getNetworth);

investorRouter.get("/:id", authLogin("investor"), getInvestor);

module.exports = investorRouter;
