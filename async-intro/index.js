const express = require('express');
const app = express();
const PORT = 3000;

// For simplicity, let's store the result in-memory.
// This will be wiped out once the server stops.
const results = {};

function simulateHighWorkload(data) {
    // Simulate a computational workload by just creating a large string.
    // This is a naive example. Real workloads can be far more complex.
    let result = '';
    for (let i = 0; i < 1e6; i++) {
        result += data;
    }
    return result;
}

app.get('/async-endpoint', (req, res) => {
    const requestId = new Date().toISOString();  // Use a timestamp as a simple request ID.

    // Simulate async operation without blocking the main thread.
    setTimeout(() => {
        const computedResult = simulateHighWorkload(requestId);
        results[requestId] = computedResult;
    }, 15000); // delay of 5 seconds

    res.json({ message: "Processing your request", requestId });
});

app.get('/results/:requestId', (req, res) => {
    const result = results[req.params.requestId];
    if (result) {
        res.json({ result: 'Data processed successfully', requestId: req.params.requestId });
    } else {
        res.status(404).json({ error: 'Result not found or not processed yet' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
