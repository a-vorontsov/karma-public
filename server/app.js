const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const PORT = process.env.PORT || 8000

require('dotenv/config')

//Import Routes
const usersRoute = require('./routes/users');

//Set view engine (for demoing views)
app.set('view-engine', 'ejs')

//Midleware
app.use(express.json())

// app.use('/', require('./routes/index'));
app.use('/users', usersRoute);

//Connect to DB

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



// Status definition function
function checkAuthenticated(req, res) {
  return false;
}

function checkNotAuthenticated(req, res) {
  return false;
}


app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
