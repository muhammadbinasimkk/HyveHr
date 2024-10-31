const sql = require('mssql');
require('dotenv').config();

// SQL Server configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST, // Server hostname (without port)
  port: parseInt(process.env.DB_PORT) || 1433, // Specify the port
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // For Azure or remote connections, use encryption
    trustServerCertificate: true // Use this for self-signed certs (like local dev or certain setups)
  },
};

// Connect to SQL Server
sql.connect(config, (err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('Connected to SQL Server database');
});

module.exports = sql;
