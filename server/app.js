const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require('express-session')
const passport = require("passport");
const crypto = require("crypto");
const PORT = process.env.PORT || 8000

require('dotenv/config')

// Import Routes
const usersRoute = require('./routes/users');

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

// Temporary. Since we don't yet have a DB connection
const users = [];

// Set view engine (for demoing views)
app.set('view-engine', 'ejs')

// -- app use -- //
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use('/users', usersRoute);

// Connect to DB
// TODO:

// -- GET REQUESTS -- //

// Render and direct to view based on user auth status
app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});


// -- POST REQUESTS -- //

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
    // TODO: be salty
  try {
    const hashedPassword = await crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("base64");
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});


// -- CLOSE REQUESTS -- //
app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// Status definition function
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // TODO:
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
