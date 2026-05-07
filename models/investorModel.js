const { db } = require("../utility/dbManager");

const invalidToken = [];

const users = [
  {
    email: "sivabhai777@gmail.com",
    password: "siva@777",
    role: "investor",
    loggedIn: false,
  },
];

const loginUser = (email, password) => {
  const userIndex = users.findIndex(
    (u) => u.email == email && u.password == password,
  );

  if (userIndex != -1) {
    users[userIndex] = {
      ...users[userIndex],
      loggedIn: true,
    };

    return users[userIndex];
  }

  return undefined;
};

const logoutUser = (email, token) => {
  const userIndex = users.findIndex(
    (u) => u.email == email && u.loggedIn == true,
  );

  if (userIndex != -1) {
    users[userIndex] = {
      ...users[userIndex],
      loggedIn: false,
    };

    invalidTokens.push(token);

    return true;
  }

  return false;
};
async function addInvestor(investor) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO investors (
        investor_id,
        first_name,
        last_name,
        email,
        phone,
        pan_number
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        investor.investor_id,
        investor.first_name,
        investor.last_name,
        investor.email,
        investor.phone,
        investor.pan_number,
      ],

      function (err) {
        if (err) {
          return reject(err);
        }

        resolve({
          message: "Investor added successfully",
          investor_id: investor.investor_id,
        });
      },
    );
  });
}
const getInvestorDB = async (investor_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM investors WHERE investor_id = ?",
      [investor_id],
      (err, row) => {
        if (err) return reject(err);

        resolve(row);
      },
    );
  });
};

async function getholdings(investor_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
          i.investor_id,
          i.first_name,
          mf.fund_name,
          SUM(it.units_allocated) AS total_units,
          mf.current_nav,
          SUM(it.units_allocated) * mf.current_nav AS current_value

      FROM investment_transactions it

      JOIN investors i
      ON it.investor_id = i.investor_id

      JOIN mutual_funds mf
      ON it.fund_id = mf.fund_id

      WHERE i.investor_id = ?

      GROUP BY
          i.investor_id,
          mf.fund_id
      `,
      [investor_id],

      (err, rows) => {
        if (err) return reject(err);

        resolve(rows);
      },
    );
  });
}

async function fetchholdings(id) {
  try {
    const investor = await getInvestorDB(id);

    if (investor == undefined) return "investor not found";

    const holdings = await getholdings(investor.investor_id);

    return holdings;
  } catch (err) {
    return err;
  }
}

async function calculate(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
          i.investor_id,
          i.first_name,

          SUM(
            holdings.total_units * holdings.current_nav
          ) AS net_worth

      FROM investors i

      JOIN (
          SELECT
              it.investor_id,
              it.fund_id,

              SUM(it.units_allocated) AS total_units,

              mf.current_nav

          FROM investment_transactions it

          JOIN mutual_funds mf
          ON it.fund_id = mf.fund_id

          GROUP BY
              it.investor_id,
              it.fund_id

      ) holdings

      ON i.investor_id = holdings.investor_id

      WHERE i.investor_id = ?

      GROUP BY
          i.investor_id,
          i.first_name
      `,
      [id],

      (err, row) => {
        if (err) {
          return reject(err);
        }

        resolve(row);
      },
    );
  });
}

async function networth(investor_id) {
  try {
    const investor = await getInvestorDB(investor_id);

    if (investor == undefined) return "investor not found";

    const networth = await calculate(investor.investor_id);

    return networth;
  } catch (err) {
    return err;
  }
}

module.exports = {
  loginUser,
  logoutUser,
  getInvestorDB,
  fetchholdings,
  networth,
  addInvestor,
  invalidToken,
};
