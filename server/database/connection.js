// following this example https://node-postgres.com/guides/project-structure
const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: 'karma-db',
    password: process.env.DB_PASS,
    port: 5432,
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
};
