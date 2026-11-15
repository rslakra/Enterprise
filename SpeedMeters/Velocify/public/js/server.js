const express = require('express');
const speedTest = require('speed-test');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to trigger the speed test
app.get('/api/speedtest', async (req, res) => {
    console.log('Received request to run speed test...');
    try {
        const test = speedTest({
            // Optional: You can configure options here
            acceptLicense: true, // required by some servers
            acceptGdpr: true
        });

        test.on('data', data => {
            console.log('Speed test data received:', data);
            // The speed-test library sends multiple data events
            // with updated progress. We only care about the final result.
        });

        test.on('error', err => {
            console.error('Speed test error:', err.message);
            res.status(500).json({ error: 'Failed to run speed test', message: err.message });
        });

        test.on('done', data => {
            const download_mbps = (data.download / 1000).toFixed(2);
            const upload_mbps = (data.upload / 1000).toFixed(2);
            const ping_ms = data.ping.toFixed(2);

            const result = {
                download_mbps: `${download_mbps} Mbps`,
                upload_mbps: `${upload_mbps} Mbps`,
                ping_ms: `${ping_ms} ms`
            };
            console.log('Speed test complete:', result);
            res.json(result);
        });

    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

