const mysql = require('mysql2');

let pool;

function connectWithRetry() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'taskdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.log('MySQL not ready yet, retrying in 2 seconds...', err.code);
      setTimeout(connectWithRetry, 2000);
    } else {
      console.log('✅ Connected to MySQL!');
      if (connection) connection.release();
    }
  });
}

connectWithRetry();

module.exports = pool;
