const express = require('express');
const {Pool} = require('pg');
const redis = require('redis');

const app = express();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

app.get('/data', async (req, res) => {
    try {
        await redisClient.connect();

        // Try fetching from Redis first
        const cachedData = await redisClient.get('data');

        if (cachedData) {
            console.log('Fetching from cache (Redis)');
            return res.send(cachedData);
        }

        // If not in cache, get from the database
        const result = await pool.query('SELECT pg_sleep(5), content FROM data_table LIMIT 1;');
        const data = result.rows[0].content;

        // Store the result in Redis with a 60-second expiration
        await redisClient.set('data', data, {
            EX: 60,
        });

        console.log('Fetching fresh data from DB and caching in Redis');
        res.send(data);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server error');
    } finally {
        redisClient.disconnect();
    }
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
