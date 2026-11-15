// server.js - Express server with WebSocket for real-time speed updates
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { SimpleSpeedTest } = require('./speedtest-core');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'START_TEST') {
            console.log('Starting speed test...');

            // Create custom speed test with progress callbacks
            const speedTest = new SimpleSpeedTest({
                onProgress: (progress) => {
                    ws.send(JSON.stringify({
                        type: 'PROGRESS',
                        data: progress
                    }));
                }
            });

            try {
                const results = await speedTest.runTestWithProgress();
                ws.send(JSON.stringify({
                    type: 'COMPLETE',
                    data: results
                }));
            } catch (error) {
                ws.send(JSON.stringify({
                    type: 'ERROR',
                    data: { message: error.message }
                }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// REST API endpoint for simple tests
app.post('/api/speedtest', async (req, res) => {
    try {
        const speedTest = new SimpleSpeedTest({ json: true, silent: true });
        const results = await speedTest.runTest();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Speed Test Server running on http://localhost:${PORT}`);
});
