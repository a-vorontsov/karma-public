// following this example https://node-postgres.com/guides/project-structure
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'karma-db',
    password: 'asd123',
    port: 5432
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
};