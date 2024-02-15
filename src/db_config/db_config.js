import mysql from 'mysql';


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mohamad88=",
    database: "shadow"
});

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mohamad88=',
    database: 'shadow',
    multipleStatements: true
});
const connectionDB = { con, pool }
export default connectionDB;