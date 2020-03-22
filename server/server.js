const log = require("./util/log");
const app = require('./app');
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    log.info(`Server started successfully. Listening on port ${PORT} ...`);
});
