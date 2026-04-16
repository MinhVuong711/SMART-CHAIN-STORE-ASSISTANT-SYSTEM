const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "987654321", 
    database: "customer_db"
});

module.exports = db;