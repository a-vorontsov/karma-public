const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000
require('dotenv/config')

//Import Routes
const usersRoute = require('./routes/users');
const forgotRoute = require('./routes/forgot');
//Midleware
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/users', usersRoute);
app.use('/login/forgot',forgotRoute);

//Connect to DB


app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
