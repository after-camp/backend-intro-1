const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Recursive Fibonacci
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

app.get('/cpu-intensive/:number', (req, res) => {
    const number = parseInt(req.params.number, 10);

    // Limit to prevent an unintentional crash.
    if (number > 40) {
        return res.status(400).send('Choose a number less than 40 for safety.');
    }

    const result = fibonacci(number);
    res.send(`Fibonacci of ${number} is ${result}`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
