require('dotenv/config');
const express = require('express');
const app = express();

// Import Routes
const usersRoute = require('./routes/users');
const userRoute = require('./routes/user');
const causesRoute = require('./routes/causes');
const forgotPasswordRoute = require('./routes/forgotPassword');
const verificationRoute = require('./routes/verification');
const eventsRoute = require('./routes/event');
// Middleware
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/users', usersRoute);
app.use('/user', userRoute);
app.use('/login/forgotPassword', forgotPasswordRoute);
app.use('/verify', verificationRoute);
app.use('/causes', causesRoute);
app.use('/event', eventsRoute);

module.exports = app;
