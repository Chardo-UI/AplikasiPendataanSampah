var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET data_sampah page. */

router.get("/data", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM sampah",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("sampah/list", {
          title: "Data Sampah",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});


router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the nama").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_berat = req.sanitize("berat").escape().trim();
    v_jenis = req.sanitize("jenis").escape().trim();
    v_daur_ulang = req.sanitize("daur_ulang").escape();

    var sampah = {
      nama: v_nama,
      jenis: v_jenis,
      berat: v_berat,
      daur_ulang: v_daur_ulang,
    };

    var insert_sql = "INSERT INTO sampah SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        sampah,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("sampah/add-sampah", {
              nama: req.param("nama"),
              jenis: req.param("jenis"),
              berat: req.param("berat"),
              daur_ulang: req.param("daur_ulang"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Berhasil Menambahkan Data Sampah");
            res.redirect("/sampah/data");
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
    res.render("sampah/add-sampah", {
      nama: req.param("nama"),
      jenis: req.param("jenis"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("sampah/add-sampah", {
    title: "Add New sampah",
    nama: "",
    berat: "",
    daur_ulang: "",
    jenis: "",
    session_store: req.session,
  });
});


router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM sampah where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/sampah");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "sampah can't be find!");
              res.redirect("/sampah");
            } else {
              console.log(rows);
              res.render("sampah/edit", {
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
    req.assert("nama", "Please fill the nama").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_berat = req.sanitize("berat").escape().trim();
      v_jenis = req.sanitize("jenis").escape().trim();
      v_daur_ulang = req.sanitize("daur_ulang").escape();

      var sampah = {
        nama: v_nama,
        jenis: v_jenis,
        berat: v_berat,
        daur_ulang: v_daur_ulang,
      };

      var update_sql = "update sampah SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          sampah,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("sampah/edit", {
                nama: req.param("nama"),
                jenis: req.param("jenis"),
                berat: req.param("berat"),
                daur_ulang: req.param("daur_ulang"),
              });
            } else {
              req.flash("msg_info", "Update sampah sukses");
              res.redirect("/sampah/edit/" + req.params.id);
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
      res.redirect("/sampah/edit/" + req.params.id);
    }
  }
);


router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var sampah = {
        id: req.params.id,
      };

      var delete_sql = "delete from sampah where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          sampah,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/sampah/data");
            } else {
              req.flash("msg_info", "Hapus Data sampah Sukses");
              res.redirect("/sampah/data");
            }
          }
        );
      });
    });
  }
);
module.exports = router;