const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

console.log('Connecting to database with connection string:', process.env.DATABASE_URL);

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log('Connected to the database:', result.rows);
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
