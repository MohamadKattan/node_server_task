import mysql from 'mysql';



var pool = mysql.createPool(options);
const connectionDB = { con, pool,options }
export default connectionDB;