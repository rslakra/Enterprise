const express = require('express');
const FastSpeedtest = require("fast-speedtest-api");

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API endpoint to trigger the speed test
app.get('/api/speedtest', async (req, res) => {
    console.log('Received request to run speed test...');

    try {
        let speedtest = new FastSpeedtest({
            token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm", // Default token from Fast.com
            verbose: false,
            timeout: 10000,
            https: true,
            urlCount: 5,
            bufferSize: 8,
            unit: FastSpeedtest.UNITS.Mbps
        });

        console.log('Testing download speed...');
        const downloadSpeed = await speedtest.getSpeed();

        const result = {
            download_mbps: `${downloadSpeed.toFixed(2)} Mbps`,
            upload_mbps: 'Not available with Fast.com',
            ping_ms: 'Not available with Fast.com',
            note: 'Using Fast.com (Netflix) speed test service'
        };

        console.log('Speed test complete:', result);
        res.json(result);

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
