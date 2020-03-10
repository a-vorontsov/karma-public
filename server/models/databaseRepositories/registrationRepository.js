const db = require("../../database/connection");

const insert = (registration) => {
    const query = "INSERT INTO registration(email, email_flag, id_flag, phone_flag, sign_up_flag) " +
        "VALUES ($1, $2, $3, $4, $5)" +
        "RETURNING *"; // returns passed registration table with it's id set to corresponding id in database
    const params = [registration.email, registration.emailFlag,
        registration.idFlag, registration.phoneFlag, registration.signUpFlag];
    return db.query(query, params);
};

const update = (registration) => {
    const query = "UPDATE registration SET email = $1, email_flag = $2, id_flag = $3, phone_flag = $4, sign_up_flag = $5 " +
        "WHERE email = $1" +
        "RETURNING *"; // returns passed registration with it's id set to corresponding id in database
    const params = [registration.email, registration.emailFlag,
        registration.idFlag, registration.phoneFlag, registration.signUpFlag];
    return db.query(query, params);
};

const findAll = () => {
    const query = "SELECT * FROM registration";
    return db.query(query);
};

const findByEmail = (email) => {
    const query = "SELECT * FROM registration WHERE email=$1";
    return db.query(query, [email]);
};

const updateSignUpFlag = (email) => {
    const query = 'UPDATE \"registration\" SET sign_up_flag = 1 WHERE email = $1 RETURNING *';
    const params = [email];
    return db.query(query, params);
};

module.exports = {
    insert: insert,
    update: update,
    findAll: findAll,
    findByEmail: findByEmail,
    updateSignUpFlag: updateSignUpFlag,
};
