const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123',
  database: 'vowelweb',
  connectionLimit: 10,
}).promise();

export default pool;