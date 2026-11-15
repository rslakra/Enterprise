const express = require('express');
const speedTest = require('speedtest-net');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to trigger the speed test
app.get('/api/speedtest', async (req, res) => {
    console.log('Received request to run speed test...');

    try {
        const test = speedTest({
            acceptLicense: true,
            acceptGdpr: true
        });

        test.on('data', data => {
            console.log('Speed test completed');

            const result = {
                download_mbps: `${(data.speeds.download).toFixed(2)} Mbps`,
                upload_mbps: `${(data.speeds.upload).toFixed(2)} Mbps`,
                ping_ms: `${data.server.ping.toFixed(2)} ms`,
                server: {
                    host: data.server.host,
                    location: `${data.server.location}, ${data.server.country}`
                }
            };

            console.log('Speed test result:', result);
            res.json(result);
        });

        test.on('error', err => {
            console.error('Speed test error:', err.message);
            res.status(500).json({
                error: 'Failed to run speed test',
                message: err.message
            });
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


