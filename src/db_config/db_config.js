import mysql from 'mysql';

const options = {
    host: 'localhost',
    user: 'root',
    password: 'mohamad88=',
    database: 'shadow',
    multipleStatements: true

}


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mohamad88=",
    database: "shadow"
});

var pool = mysql.createPool(options);
const connectionDB = { con, pool,options }
export default connectionDB;