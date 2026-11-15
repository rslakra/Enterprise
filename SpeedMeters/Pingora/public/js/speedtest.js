// speedtest.js - Client-side JavaScript for speed test UI
class SpeedTestUI {
    constructor() {
        this.ws = null;
        this.chart = null;
        this.maxDownloadSpeed = 0;
        this.maxUploadSpeed = 0;
        this.speedHistory = {
            download: [],
            upload: [],
            labels: []
        };
        this.isRunning = false;
        // this.initializeChart();
        this.attachEventListeners();
    }

    initializeChart() {
        const ctx = document.getElementById('speedChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Download Speed',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Upload Speed',
                    data: [],
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Speed (Mbps)'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    attachEventListeners() {
        document.getElementById('startTest').addEventListener('click', () => {
            this.startSpeedTest();
        });
    }

    connectWebSocket() {
        return new Promise((resolve, reject) => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}`;

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                resolve();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isRunning = false;
                this.updateUI('ready');
            };
        });
    }

    handleMessage(message) {
        switch (message.type) {
            case 'PROGRESS':
                this.updateProgress(message.data);
                break;
            case 'COMPLETE':
                this.displayResults(message.data);
                break;
            case 'ERROR':
                this.handleError(message.data);
                break;
        }
    }

    updateProgress(data) {
        const { type, speed, progress, phase } = data;

        if (type === 'download') {
            this.updateGauge('download', speed);
            this.updateStatus(`Testing download speed... ${progress.toFixed(0)}%`);
            this.updateProgressBar(progress);

            if (speed > this.maxDownloadSpeed) {
                this.maxDownloadSpeed = speed;
                document.getElementById('downloadMax').textContent = `${speed.toFixed(2)} Mbps`;
            }
        } else if (type === 'upload') {
            this.updateGauge('upload', speed);
            this.updateStatus(`Testing upload speed... ${progress.toFixed(0)}%`);
            this.updateProgressBar(50 + progress / 2); // Upload is second half

            if (speed > this.maxUploadSpeed) {
                this.maxUploadSpeed = speed;
                document.getElementById('uploadMax').textContent = `${speed.toFixed(2)} Mbps`;
            }
        } else if (type === 'ping') {
            this.updateStatus(`Testing latency... ${progress.toFixed(0)}%`);
            this.updateProgressBar(progress / 4); // Ping is first quarter
        } else if (type === 'info') {
            this.updateStatus('Getting connection information...');
        }

        // Update real-time chart
        if (type === 'download' || type === 'upload') {
            this.updateRealtimeChart(type, speed);
        }
    }

    updateGauge(type, speed) {
        const maxSpeed = 200; // Max speed for gauge (200 Mbps)
        const rotation = Math.min((speed / maxSpeed) * 180, 180);

        const gaugeElement = document.getElementById(`${type}Gauge`);
        const valueElement = document.getElementById(`${type}Value`);

        gaugeElement.style.transform = `rotate(${rotation}deg)`;
        valueElement.textContent = speed.toFixed(1);

        // Add animation class
        valueElement.parentElement.classList.add('testing');
    }

    updateRealtimeChart(type, speed) {
        const now = new Date().toLocaleTimeString();

        if (!this.speedHistory.labels.includes(now)) {
            this.speedHistory.labels.push(now);
            this.speedHistory.download.push(type === 'download' ? speed : null);
            this.speedHistory.upload.push(type === 'upload' ? speed : null);
        } else {
            const index = this.speedHistory.labels.indexOf(now);
            if (type === 'download') {
                this.speedHistory.download[index] = speed;
            } else {
                this.speedHistory.upload[index] = speed;
            }
        }

        // Keep only last 20 data points
        if (this.speedHistory.labels.length > 20) {
            this.speedHistory.labels.shift();
            this.speedHistory.download.shift();
            this.speedHistory.upload.shift();
        }

        // Update chart
        this.chart.data.labels = this.speedHistory.labels;
        this.chart.data.datasets[0].data = this.speedHistory.download;
        this.chart.data.datasets[1].data = this.speedHistory.upload;
        this.chart.update('none'); // Update without animation for smooth real-time updates
    }

    updateStatus(message) {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = message;
        statusElement.classList.add('active');
    }

    updateProgressBar(percentage) {
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    async startSpeedTest() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.resetUI();
        this.updateUI('testing');

        try {
            // Connect WebSocket if not connected
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                await this.connectWebSocket();
            }

            // Send start test message
            this.ws.send(JSON.stringify({ type: 'START_TEST' }));

        } catch (error) {
            console.error('Failed to start test:', error);
            this.handleError({ message: 'Failed to connect to server' });
        }
    }

    displayResults(results) {
        console.log('Test complete:', results);

        // Update final values
        this.updateGauge('download', results.download.mbps || 0);
        this.updateGauge('upload', results.upload.mbps || 0);

        // Update stats
        document.getElementById('pingValue').textContent =
            results.ping.latency ? `${results.ping.latency} ms` : '-- ms';
        document.getElementById('jitterValue').textContent =
            results.ping.jitter ? `${results.ping.jitter} ms` : '-- ms';

        // Update client info
        if (results.client) {
            document.getElementById('clientInfo').style.display = 'block';
            document.getElementById('clientIp').textContent = results.client.ip || '--';
            document.getElementById('clientIsp').textContent = results.client.isp || '--';
            document.getElementById('clientLocation').textContent =
                `${results.client.city || ''}, ${results.client.country || ''}`;
            document.getElementById('testServer').textContent =
                results.server ? results.server.name : '--';
        }

        // Update status
        this.updateStatus('Test completed successfully!');
        this.updateProgressBar(100);

        // Reset UI state
        setTimeout(() => {
            this.isRunning = false;
            this.updateUI('ready');
            this.updateProgressBar(0);

            // Remove animation classes
            document.querySelectorAll('.testing').forEach(el => {
                el.classList.remove('testing');
            });
        }, 3000);

        // Close WebSocket
        if (this.ws) {
            this.ws.close();
        }
    }

    handleError(error) {
        console.error('Speed test error:', error);
        this.updateStatus(`Error: ${error.message}`);
        this.isRunning = false;
        this.updateUI('error');

        // Reset after 5 seconds
        setTimeout(() => {
            this.resetUI();
            this.updateUI('ready');
        }, 5000);
    }

    resetUI() {
        // Reset gauges
        this.updateGauge('download', 0);
        this.updateGauge('upload', 0);

        // Reset max values
        this.maxDownloadSpeed = 0;
        this.maxUploadSpeed = 0;
        document.getElementById('downloadMax').textContent = '-- Mbps';
        document.getElementById('uploadMax').textContent = '-- Mbps';

        // Reset stats
        document.getElementById('pingValue').textContent = '-- ms';
        document.getElementById('jitterValue').textContent = '-- ms';

        // Clear progress
        this.updateProgressBar(0);
    }

    updateUI(state) {
        const button = document.getElementById('startTest');
        const statusElement = document.getElementById('statusMessage');

        switch (state) {
            case 'ready':
                button.textContent = 'Start Speed Test';
                button.disabled = false;
                statusElement.classList.remove('active');
                break;
            case 'testing':
                button.textContent = 'Testing...';
                button.disabled = true;
                break;
            case 'error':
                button.textContent = 'Start Speed Test';
                button.disabled = false;
                break;
        }
    }
}

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpeedTestUI();
});

// Alternative: Use REST API for simple test without WebSocket
async function runSimpleSpeedTest() {
    try {
        const response = await fetch('/api/speedtest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Test failed');
        }

        const results = await response.json();
        console.log('Speed test results:', results);
        return results;
    } catch (error) {
        console.error('Speed test error:', error);
        throw error;
    }
}