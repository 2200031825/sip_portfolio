const sql = require("sqlite3");
const db = new sql.Database("C:/Users/ynith/Downloads/sqlite/sip", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected successfully");
  }
});

module.exports = { db };
