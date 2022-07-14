const controller = {};
const { DATA } = require("../../fakedatabase.js");

controller.list = (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  res.setHeader("Content-Type", "application/json");
  const name = req.query.name ? req.query.name : null;
  if (!name) return res.status(400).send();

  const sql = `SELECT * FROM contacts WHERE activo = 1 ORDER BY name `;
  req.getConnection((err, conn) => {
    conn.query(sql, (err, data) => {
      if (err) {
        res.json({
          success: false,
          message: "Error!",
        });
      } else {
        let coinciden = JSON.parse(JSON.stringify(data));
        let noCoinciden = JSON.parse(JSON.stringify(data));
        coinciden = coinciden.filter((item) => {
          if (item.name.toLowerCase().includes(name.toLowerCase())) {
            return item;
          }
        });
        noCoinciden = noCoinciden.filter((item) => {
          if (!item.name.toLowerCase().includes(name.toLowerCase())) {
            return item;
          }
        });
        return res.status(201).json({
          success: true,
          message: "Get Contacts",
          data: { coinciden: coinciden, noCoinciden: noCoinciden },
        });
      }
    });
  });
};

controller.save = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  req.getConnection((err, conn) => {
    const list = JSON.parse(JSON.stringify(DATA));
    let contactsInsert = `INSERT INTO contacts (uid,name,phone,address) VALUES ?`;
    conn.query(
      contactsInsert,
      [
        list.map((item) => [
          item.id,
          item.name,
          item.phone,
          JSON.stringify(item.addressLines),
        ]),
      ],
      function (err, data) {
        if (err) {
          res.json(err);
        } else {
          res.json(data);
        }
      }
    );
  });
};

controller.getContact = (req, res) => {
  if (req.method !== "GET") return res.status(405).end();
  res.setHeader("Content-Type", "application/json");
  req.getConnection((err, conn) => {
    const id = req.params.id ? req.query.id : null;
    if (!id) return res.status(404).render("404");
    let query = `SELECT * FROM contacts WHERE id = ${id}`;
    conn.query(query, (err, data) => {
      if (err) {
        res.json(err);
      } else {
        if (data.length > 0) {
          return res.status(200).json({
            success: true,
            message: "Get Contact " + data[0].name,
            data: data[0],
          });
        } else {
          return res.status(404).render("404");
        }
      }
    });
  });
};

controller.deleteContact = (req, res) => {
  if (req.method !== "DELETE") return res.status(405).end();
  res.setHeader("Content-Type", "application/json");
  req.getConnection((err, conn) => {
    const id = req.params.id ? req.params.id : null;
    if (!id) return res.status(404).render("404");
    let query = `DELETE FROM contacts WHERE id = ${id}`;
    conn.query(query, (err, data) => {
      if (err) {
        res.json(err);
      } else {
        if (data.affectedRows) {
          return res.status(204).end();
        } else {
          return res.status(404).render("404");
        }
      }
    });
  });
};
module.exports = controller;
