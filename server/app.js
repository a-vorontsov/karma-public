const express = require('express');
const app = express();
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


// Status definition function
function checkAuthenticated(req, res) {
  return false;
}

function checkNotAuthenticated(req, res) {
  return false;
}


app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
