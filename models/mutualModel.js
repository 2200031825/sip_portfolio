const { db } = require("../utility/dbManager");

function createFund(data) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO mutual_funds (
        fund_id,
        amc_id,
        fund_name,
        scheme_code,
        fund_type,
        category,
        risk_level,
        expense_ratio,
        current_nav,
        launch_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        data.fund_id,
        data.amc_id,
        data.fund_name,
        data.scheme_code,
        data.fund_type,
        data.category,
        data.risk_level,
        data.expense_ratio,
        data.current_nav,
        data.launch_date,
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: "Fund created successfully",
            id: data.fund_id,
          });
        }
      },
    );
  });
}

function getAllFunds() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM mutual_funds
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function updateFundNav(fundId, nav) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE mutual_funds
      SET current_nav = ?
      WHERE fund_id = ?
    `;

    db.run(query, [nav, fundId], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({
          updatedRows: this.changes,
        });
      }
    });
  });
}

module.exports = {
  createFund,
  getAllFunds,
  updateFundNav,
};
