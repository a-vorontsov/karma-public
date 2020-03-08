// following this example https://node-postgres.com/guides/project-structure
const pg = require('pg');
const pgCamelCase = require('pg-camelcase');
const {Pool} = pg;
const types = pg.types;

pgCamelCase.inject(pg);
types.setTypeParser(1700, 'text', parseFloat); // converts Postgres numeric types to js Numbers


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
    end: () => pool.end(),
};
