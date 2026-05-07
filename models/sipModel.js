const { db } = require("../utility/dbManager");

function createSip(data) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO sip_registrations (
        sip_id,
        investor_id,
        fund_id,
        portfolio_id,
        sip_amount,
        sip_date,
        start_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [
        data.sip_id,
        data.investor_id,
        data.fund_id,
        data.portfolio_id,
        data.sip_amount,
        data.sip_date,
        data.start_date,
        data.status || "ACTIVE",
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            message: "SIP created successfully",
            id: data.sip_id,
          });
        }
      },
    );
  });
}

function getSipById(sipId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM sip_registrations
      WHERE sip_id = ?
    `;

    db.get(query, [sipId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function processSip(sipId) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const getSipQuery = `
        SELECT
          sr.*,
          mf.current_nav
        FROM sip_registrations sr
        JOIN mutual_funds mf
        ON sr.fund_id = mf.fund_id
        WHERE sr.sip_id = ?
      `;

      db.get(getSipQuery, [sipId], (err, sip) => {
        if (err) {
          db.run("ROLLBACK");

          reject(err);
          return;
        }

        if (!sip) {
          db.run("ROLLBACK");

          resolve(undefined);
          return;
        }

        const units = sip.sip_amount / sip.current_nav;

        const transactionId = "TXN" + Date.now();

        const insertTransactionQuery = `
          INSERT INTO investment_transactions (
            transaction_id,
            sip_id,
            investor_id,
            fund_id,
            transaction_type,
            amount,
            nav_used,
            units_allocated,
            transaction_date
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE('now'))
        `;

        db.run(
          insertTransactionQuery,
          [
            transactionId,
            sip.sip_id,
            sip.investor_id,
            sip.fund_id,
            "BUY",
            sip.sip_amount,
            sip.current_nav,
            units,
          ],
          function (err) {
            if (err) {
              db.run("ROLLBACK");

              reject(err);
              return;
            }

            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.run("ROLLBACK");

                reject(commitErr);
              } else {
                resolve({
                  message: "SIP processed successfully",

                  transaction_id: transactionId,

                  units_allocated: units,
                });
              }
            });
          },
        );
      });
    });
  });
}
function getSipTransactions(sipId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM investment_transactions
      WHERE sip_id = ?
      ORDER BY transaction_date DESC
    `;

    db.all(query, [sipId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  createSip,
  getSipById,
  processSip,
  getSipTransactions,
};
