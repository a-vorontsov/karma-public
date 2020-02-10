const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000
require('dotenv/config')

//Import Routes
const usersRoute = require('./routes/users');
//Midleware
app.use(express.json())

// app.use('/', require('./routes/index'));
app.use('/users', usersRoute);

//Connect to DB


app.get("/", (req, res) => {
  res.render('register.ejs');
});


app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
