const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const index = require("./routes/index");
const users = require("./routes/users");

const app = express();

//Passport config
require("./config/passport")(passport);

//DB CONFIG
const db = require("./config/keys").MONGOURI;

//CONNECT
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Mongo DB connected....");
  })
  .catch(err => console.log(error));

const PORT = process.env.PORT || 5000;

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//EXPRESS SESSION
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//CONNECT FLASH
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//ROUTES
app.use("/", index);
app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
