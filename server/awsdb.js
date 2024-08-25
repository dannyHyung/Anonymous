const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.AWS_DB_USER,           // RDS DB username
    host: process.env.AWS_DB_HOST,           // RDS instance endpoint
    database: process.env.AWS_DB_NAME,       // database name
    password: process.env.AWS_DB_PASSWORD,   // database password
    port: process.env.AWS_DB_PORT || 5432,   // RDS instance port
    ssl: {
        rejectUnauthorized: false,          
    }
});

console.log('Connecting to AWS RDS database:', process.env.AWS_DB_NAME);

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log('Connected to the AWS RDS database:', result.rows);
    });
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: async (text, params) => {
        try {
            console.log('Executing query:', text);
            const result = await pool.query(text, params);
            console.log('Query result:', result.rows);
            return result;
        } catch (err) {
            console.error('Error executing query:', err.message);
            throw err;
        }
    },
};
