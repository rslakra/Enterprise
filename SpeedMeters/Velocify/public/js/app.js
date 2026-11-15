// Speed Test UI Application
class SpeedTestApp {
    constructor() {
        this.isRunning = false;
        this.testHistory = this.loadHistory();
        this.initializeElements();
        this.bindEvents();
        this.renderHistory();
    }

    initializeElements() {
        // Buttons and controls
        this.startButton = document.getElementById('startButton');
        this.buttonText = document.getElementById('buttonText');
        this.spinner = document.getElementById('spinner');
        this.statusMessage = document.getElementById('statusMessage');

        // Metric displays
        this.downloadSpeed = document.getElementById('downloadSpeed');
        this.uploadSpeed = document.getElementById('uploadSpeed');
        this.pingValue = document.getElementById('pingValue');
        this.jitterValue = document.getElementById('jitterValue');

        // Progress bars
        this.downloadProgress = document.getElementById('downloadProgress');
        this.uploadProgress = document.getElementById('uploadProgress');

        // Server info
        this.serverInfo = document.getElementById('serverInfo');
        this.serverName = document.getElementById('serverName');
        this.serverLocation = document.getElementById('serverLocation');

        // History
        this.historyContainer = document.getElementById('historyContainer');
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startTest());
    }

    async startTest() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.resetUI();
        this.setButtonState(true);

        try {
            const eventSource = new EventSource('/api/speedtest');

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.error) {
                    this.handleError(data.message);
                    eventSource.close();
                    return;
                }

                if (data.completed) {
                    this.handleResults(data);
                    eventSource.close();
                    return;
                }

                if (data.status) {
                    this.updateStatus(data.status);
                }

                if (data.progress !== undefined) {
                    this.updateProgress(data.status, data.progress);
                }
            };

            eventSource.onerror = (error) => {
                console.error('EventSource error:', error);
                this.handleError('Connection lost. Please try again.');
                eventSource.close();
            };

            // Start the test by making POST request
            const response = await fetch('/api/speedtest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            this.handleError('Failed to start speed test. Please check your connection.');
        }
    }

    resetUI() {
        this.downloadSpeed.textContent = '--';
        this.uploadSpeed.textContent = '--';
        this.pingValue.textContent = '--';
        this.jitterValue.textContent = 'Jitter: -- ms';
        this.downloadProgress.style.width = '0%';
        this.uploadProgress.style.width = '0%';
        this.serverInfo.classList.add('hidden');

        // Add animation classes
        this.downloadSpeed.classList.remove('updating');
        this.uploadSpeed.classList.remove('updating');
        this.pingValue.classList.remove('updating');
    }

    setButtonState(disabled) {
        this.startButton.disabled = disabled;
        if (disabled) {
            this.buttonText.textContent = 'Testing...';
            this.spinner.classList.remove('hidden');
        } else {
            this.buttonText.textContent = 'Start Test';
            this.spinner.classList.add('hidden');
        }
    }

    updateStatus(status) {
        this.statusMessage.textContent = status;

        // Add visual feedback based on status
        if (status.includes('download')) {
            this.downloadSpeed.classList.add('updating');
        } else if (status.includes('upload')) {
            this.downloadSpeed.classList.remove('updating');
            this.uploadSpeed.classList.add('updating');
        }
    }

    updateProgress(status, progress) {
        if (status.includes('download')) {
            this.downloadProgress.style.width = `${progress}%`;
        } else if (status.includes('upload')) {
            this.uploadProgress.style.width = `${progress}%`;
        }
    }

    handleResults(data) {
        // Update displays with animation
        this.animateValue(this.downloadSpeed, 0, data.download_mbps, 1000);
        this.animateValue(this.uploadSpeed, 0, data.upload_mbps, 1000);
        this.animateValue(this.pingValue, 0, data.ping_ms, 1000);

        this.jitterValue.textContent = `Jitter: ${data.jitter_ms} ms`;

        // Update progress bars to 100%
        this.downloadProgress.style.width = '100%';
        this.uploadProgress.style.width = '100%';

        // Show server info
        if (data.server) {
            this.serverName.textContent = data.server.name;
            this.serverLocation.textContent = data.server.location;
            this.serverInfo.classList.remove('hidden');
        }

        // Update status
        this.statusMessage.textContent = 'Test completed successfully!';

        // Save to history
        this.saveToHistory(data);

        // Reset button state
        this.isRunning = false;
        this.setButtonState(false);

        // Remove animation classes
        setTimeout(() => {
            this.downloadSpeed.classList.remove('updating');
            this.uploadSpeed.classList.remove('updating');
            this.pingValue.classList.remove('updating');
        }, 1000);
    }

    handleError(message) {
        this.statusMessage.textContent = `Error: ${message}`;
        this.statusMessage.style.color = '#e74c3c';
        this.isRunning = false;
        this.setButtonState(false);

        setTimeout(() => {
            this.statusMessage.style.color = '#666';
        }, 3000);
    }

    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const isInteger = Number.isInteger(end);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;

            element.textContent = isInteger ? Math.round(current) : current.toFixed(2);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = isInteger ? Math.round(end) : end.toFixed(2);
            }
        };

        requestAnimationFrame(animate);
    }

    saveToHistory(data) {
        const historyItem = {
            timestamp: data.timestamp,
            download: data.download_mbps,
            upload: data.upload_mbps,
            ping: data.ping_ms,
            server: data.server ? data.server.name : 'Unknown'
        };

        this.testHistory.unshift(historyItem);

        // Keep only last 10 tests
        if (this.testHistory.length > 10) {
            this.testHistory.pop();
        }

        localStorage.setItem('speedTestHistory', JSON.stringify(this.testHistory));
        this.renderHistory();
    }

    loadHistory() {
        const saved = localStorage.getItem('speedTestHistory');
        return saved ? JSON.parse(saved) : [];
    }

    renderHistory() {
        if (this.testHistory.length === 0) {
            this.historyContainer.innerHTML = '<p class="no-history">No tests performed yet</p>';
            return;
        }

        this.historyContainer.innerHTML = this.testHistory.map(item => {
            const date = new Date(item.timestamp);
            const timeString = date.toLocaleString();

            return `
                <div class="history-item">
                    <div>
                        <div class="history-item-time">${timeString}</div>
                        <div class="history-item-speeds">
                            <span>⬇️ ${item.download} Mbps</span>
                            <span>⬆️ ${item.upload} Mbps</span>
                            <span>📡 ${item.ping} ms</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SpeedTestApp();
});

// Optional: Add keyboard shortcut (Space) to start test
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && event.target.tagName !== 'BUTTON') {
        event.preventDefault();
        document.getElementById('startButton').click();
    }
});