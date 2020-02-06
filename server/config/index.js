const express = require('express');
const app = express();

//Import Routes
const usersRoute = require('../routes/users');
//Midleware
app.use(express.json())
app.use('/', require('../routes/index'));
app.use('/users', usersRoute);


module.exports = app