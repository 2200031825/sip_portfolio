const sql = require("sqlite3");
const express = require("express");
const app = express();

app.use(express.json());
const investorRoutes = require("./routes/investorRoutes");

app.use("/api/investor", investorRoutes);
const mutualFundRoutes = require("./routes/mutualRoutes");

app.use(mutualFundRoutes);

const sipRoutes = require("./routes/sipRoutes");

app.use(sipRoutes);
app.listen(3000, () => {
  console.log("server is running");
});
