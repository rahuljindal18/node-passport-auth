const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//MODEL
const User = require("../models/User");

//ROUTES
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

//Register handle

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  const errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "password and confirm password do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "password must be minimum of 6 chars" });
  }
  if (errors.length) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validations passed
    User.findOne({ email }).then(user => {
      if (user) {
        //user exists
        errors.push({ msg: "email is already registered." });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set hashed password
            newUser.password = hash;
            //save new user to db
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are successfully registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//Login Handle

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//logout handle

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
