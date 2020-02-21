require('dotenv/config');
const express = require('express');
const app = express();

// Import Routes
const usersRoute = require('./routes/users');
const forgotPasswordRoute = require('./routes/forgotPassword');
const verificationRoute = require('./routes/verification');
const eventsRoute = require('./routes/event');

// Middleware
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/users', usersRoute);
app.use('/login/forgotPassword', forgotPasswordRoute);
app.use('/verify', verificationRoute);
app.use('/events', eventsRoute);

module.exports = app;
