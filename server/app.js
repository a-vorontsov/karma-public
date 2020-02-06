const app = require('./config');
const PORT = process.env.PORT || 8000
require('dotenv/config')

//Connect to DB


app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
