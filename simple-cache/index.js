const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const cache = {};

app.get('/data', async (req, res) => {
    if (cache['data']) {
        console.log('Fetching from cache');
        return res.send(cache['data']);
    }

    try {
        // Simulate a delay by introducing a SQL sleep (this is just for the demonstration, not ideal for real-world scenarios)
        const result = await pool.query('SELECT pg_sleep(5), * FROM data_table LIMIT 1;');
        const data = result.rows[0];

        cache['data'] = data;

        console.log('Fetching fresh data from DB and caching');
        res.send(data);
    } catch (err) {
        res.status(500).send('Database error');
    }
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
