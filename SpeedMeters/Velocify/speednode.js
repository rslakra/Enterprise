const express = require('express');
const speedtest = require('@sparticuz/node-speedtest');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to trigger the speed test
app.get('/api/speedtest', async (req, res) => {
    console.log('Received request to run speed test...');

    try {
        const s = await speedtest({
            acceptLicense: true,
            acceptGdpr: true
        });

        // Run the speed test
        s.on('data', (data) => {
            const result = {
                download_mbps: `${data.speeds.download.toFixed(2)} Mbps`,
                upload_mbps: `${data.speeds.upload.toFixed(2)} Mbps`,
                ping_ms: `${data.server.ping.toFixed(2)} ms`,
                server: {
                    host: data.server.host,
                    location: `${data.server.location}, ${data.server.country}`
                }
            };

            console.log('Speed test complete:', result);
            res.json(result);
        });

        s.on('error', (err) => {
            console.error('Speed test error:', err);
            res.status(500).json({
                error: 'Failed to run speed test',
                message: err.toString()
            });
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: err.toString()
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
