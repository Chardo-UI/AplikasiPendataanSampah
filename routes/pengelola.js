var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET pengelola page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM pengelola",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("pengelola/list", {
          title: "pengelola",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.get("/home", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      function (err, rows) {
        res.render("pengelola/home", {
          title: "pengelola",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var pengelola = {
        id: req.params.id,
      };

      var delete_sql = "delete from pengelola where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          pengelola,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/pengelola");
            } else {
              req.flash("msg_info", "Delete pengelola Success");
              res.redirect("/pengelola");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM pengelola where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/pengelola");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "pengelola can't be find!");
              res.redirect("/pengelola");
            } else {
              console.log(rows);
              res.render("pengelola/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("name", "Please fill the name").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_name = req.sanitize("name").escape().trim();
      v_email = req.sanitize("email").escape().trim();
      v_address = req.sanitize("address").escape().trim();
      v_phone = req.sanitize("phone").escape();

      var pengelola = {
        name: v_name,
        address: v_address,
        email: v_email,
        phone: v_phone,
      };

      var update_sql = "update pengelola SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          pengelola,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("pengelola/edit", {
                name: req.param("name"),
                address: req.param("address"),
                email: req.param("email"),
                phone: req.param("phone"),
              });
            } else {
              req.flash("msg_info", "Update pengelola success");
              res.redirect("/pengelola/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/pengelola/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("name", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_name = req.sanitize("name").escape().trim();
    v_email = req.sanitize("email").escape().trim();
    v_address = req.sanitize("address").escape().trim();
    v_phone = req.sanitize("phone").escape();

    var pengelola = {
      name: v_name,
      address: v_address,
      email: v_email,
      phone: v_phone,
    };

    var insert_sql = "INSERT INTO pengelola SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        pengelola,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("pengelola/add-pengelola", {
              name: req.param("name"),
              address: req.param("address"),
              email: req.param("email"),
              phone: req.param("phone"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create pengelola success");
            res.redirect("/pengelola");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("pengelola/add-pengelola", {
      name: req.param("name"),
      address: req.param("address"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("pengelola/add-pengelola", {
    title: "Add New pengelola",
    name: "",
    email: "",
    phone: "",
    address: "",
    session_store: req.session,
  });
});

module.exports = router;