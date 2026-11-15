// speedtest-core.js - Enhanced speed test with progress callbacks
const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');
const crypto = require('crypto');

class SimpleSpeedTest {
    constructor(options = {}) {
        this.jsonOutput = options.json || false;
        this.silent = options.silent || false;
        this.onProgress = options.onProgress || null;
        this.testFileUrls = {
            download: [
                { url: 'http://speedtest.tele2.net/1MB.zip', size: 1048576 },
                { url: 'http://speedtest.tele2.net/10MB.zip', size: 10485760 },
                { url: 'http://speedtest.tele2.net/100MB.zip', size: 104857600 }
            ],
            upload: [
                { url: 'https://httpbin.org/post', size: 1048576 },    // 1MB
                { url: 'https://httpbin.org/post', size: 5242880 },    // 5MB
                { url: 'https://httpbin.org/post', size: 10485760 }    // 10MB
            ]
        };
    }

    log(message) {
        if (!this.silent && !this.jsonOutput) {
            console.log(message);
        }
    }

    sendProgress(type, speed, progress, phase) {
        if (this.onProgress) {
            this.onProgress({
                type,
                speed,
                progress,
                phase,
                timestamp: Date.now()
            });
        }
    }

    generateRandomData(size) {
        const chunks = [];
        const chunkSize = 1024 * 1024; // 1MB chunks
        let remaining = size;

        while (remaining > 0) {
            const currentChunkSize = Math.min(remaining, chunkSize);
            chunks.push(crypto.randomBytes(currentChunkSize));
            remaining -= currentChunkSize;
        }

        return Buffer.concat(chunks);
    }

    async testDownloadSpeedWithProgress(url, expectedSize, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = performance.now();
            let dataReceived = 0;
            let lastProgressUpdate = 0;

            const protocol = url.startsWith('https') ? https : http;

            const request = protocol.get(url, (response) => {
                const contentLength = parseInt(response.headers['content-length'] || expectedSize);

                response.on('data', (chunk) => {
                    dataReceived += chunk.length;
                    const now = Date.now();

                    // Send progress updates every 100ms
                    if (now - lastProgressUpdate > 100) {
                        const progress = (dataReceived / contentLength) * 100;
                        const currentTime = performance.now();
                        const duration = (currentTime - startTime) / 1000;
                        const speedBps = (dataReceived * 8) / duration;
                        const speedMbps = speedBps / 1000000;

                        this.sendProgress('download', speedMbps, progress, 'downloading');
                        lastProgressUpdate = now;
                    }
                });

                response.on('end', () => {
                    const endTime = performance.now();
                    const duration = (endTime - startTime) / 1000;
                    const speedBps = (dataReceived * 8) / duration;
                    const speedMbps = speedBps / 1000000;

                    this.sendProgress('download', speedMbps, 100, 'complete');

                    resolve({
                        url,
                        bytesReceived: dataReceived,
                        duration,
                        speedMbps
                    });
                });
            });

            request.on('error', reject);
            request.setTimeout(timeout, () => {
                request.destroy();
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000;
                const speedBps = (dataReceived * 8) / duration;
                const speedMbps = speedBps / 1000000;

                resolve({
                    url,
                    bytesReceived: dataReceived,
                    duration,
                    speedMbps,
                    timeout: true
                });
            });
        });
    }

    async testUploadSpeedWithProgress(url, dataSize, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const data = this.generateRandomData(dataSize);
            const startTime = performance.now();
            let bytesSent = 0;
            let lastProgressUpdate = 0;

            const urlParts = new URL(url);
            const options = {
                hostname: urlParts.hostname,
                port: urlParts.port || 443,
                path: urlParts.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': data.length
                }
            };

            const protocol = url.startsWith('https') ? https : http;
            const req = protocol.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    const endTime = performance.now();
                    const duration = (endTime - startTime) / 1000;
                    const speedBps = (data.length * 8) / duration;
                    const speedMbps = speedBps / 1000000;

                    this.sendProgress('upload', speedMbps, 100, 'complete');

                    resolve({
                        url,
                        bytesSent: data.length,
                        duration,
                        speedMbps
                    });
                });
            });

            req.on('error', reject);
            req.setTimeout(timeout, () => {
                req.destroy();
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000;
                const speedBps = (data.length * 8) / duration;
                const speedMbps = speedBps / 1000000;

                resolve({
                    url,
                    bytesSent: data.length,
                    duration,
                    speedMbps,
                    timeout: true
                });
            });

            // Simulate progress for upload
            const chunkSize = 65536; // 64KB chunks
            let sent = 0;

            const sendChunk = () => {
                if (sent < data.length) {
                    const end = Math.min(sent + chunkSize, data.length);
                    req.write(data.slice(sent, end), () => {
                        sent = end;
                        bytesSent = sent;

                        const now = Date.now();
                        if (now - lastProgressUpdate > 100) {
                            const progress = (bytesSent / data.length) * 100;
                            const currentTime = performance.now();
                            const duration = (currentTime - startTime) / 1000;
                            if (duration > 0) {
                                const speedBps = (bytesSent * 8) / duration;
                                const speedMbps = speedBps / 1000000;
                                this.sendProgress('upload', speedMbps, progress, 'uploading');
                                lastProgressUpdate = now;
                            }
                        }

                        sendChunk();
                    });
                } else {
                    req.end();
                }
            };

            sendChunk();
        });
    }

    async testPing(host = 'google.com') {
        const samples = [];
        const numSamples = 3;

        this.sendProgress('ping', 0, 0, 'testing');

        for (let i = 0; i < numSamples; i++) {
            const startTime = performance.now();

            await new Promise((resolve) => {
                https.get(`https://${host}`, (res) => {
                    const endTime = performance.now();
                    const ping = endTime - startTime;
                    samples.push(ping);
                    res.destroy();
                    resolve();
                }).on('error', () => {
                    samples.push(-1);
                    resolve();
                });
            });

            this.sendProgress('ping', 0, ((i + 1) / numSamples) * 100, 'testing');
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const validSamples = samples.filter(s => s > 0);
        if (validSamples.length === 0) return -1;

        const avgPing = validSamples.reduce((a, b) => a + b, 0) / validSamples.length;
        const minPing = Math.min(...validSamples);
        const maxPing = Math.max(...validSamples);

        this.sendProgress('ping', avgPing, 100, 'complete');

        return {
            avg: avgPing,
            min: minPing,
            max: maxPing,
            samples: validSamples.length
        };
    }

    async getClientInfo() {
        this.sendProgress('info', 0, 0, 'fetching');

        return new Promise((resolve) => {
            https.get('https://ipapi.co/json/', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const info = JSON.parse(data);
                        this.sendProgress('info', 0, 100, 'complete');
                        resolve({
                            ip: info.ip || 'Unknown',
                            isp: info.org || 'Unknown',
                            city: info.city || 'Unknown',
                            region: info.region || 'Unknown',
                            country: info.country_name || 'Unknown',
                            countryCode: info.country_code || 'Unknown',
                            latitude: info.latitude || null,
                            longitude: info.longitude || null
                        });
                    } catch {
                        this.sendProgress('info', 0, 100, 'complete');
                        resolve({
                            ip: 'Unknown',
                            isp: 'Unknown',
                            city: 'Unknown',
                            region: 'Unknown',
                            country: 'Unknown',
                            countryCode: 'Unknown',
                            latitude: null,
                            longitude: null
                        });
                    }
                });
            }).on('error', () => {
                this.sendProgress('info', 0, 100, 'complete');
                resolve({
                    ip: 'Unknown',
                    isp: 'Unknown',
                    city: 'Unknown',
                    region: 'Unknown',
                    country: 'Unknown',
                    countryCode: 'Unknown',
                    latitude: null,
                    longitude: null
                });
            });
        });
    }

    async runTestWithProgress() {
        const testResults = {
            timestamp: new Date().toISOString(),
            client: {},
            speeds: {
                download: { bandwidth: null, bytes: null, elapsed: null },
                upload: { bandwidth: null, bytes: null, elapsed: null }
            },
            ping: { latency: null, min: null, max: null },
            server: {
                name: 'Mixed Test Servers',
                location: 'Multiple Locations',
                country: 'Global',
                host: 'speedtest.tele2.net / httpbin.org',
                id: null
            }
        };

        try {
            // Get client information
            const clientInfo = await this.getClientInfo();
            testResults.client = clientInfo;
            testResults.isp = clientInfo.isp;

            // Test ping
            const pingResults = await this.testPing();
            if (pingResults !== -1) {
                testResults.ping.latency = parseFloat(pingResults.avg.toFixed(2));
                testResults.ping.min = parseFloat(pingResults.min.toFixed(2));
                testResults.ping.max = parseFloat(pingResults.max.toFixed(2));
            }

            // Test download speed
            const downloadResults = [];
            let totalDownloadBytes = 0;
            let totalDownloadDuration = 0;

            for (let i = 0; i < Math.min(2, this.testFileUrls.download.length); i++) {
                const test = this.testFileUrls.download[i];
                try {
                    const result = await this.testDownloadSpeedWithProgress(test.url, test.size, 8000);
                    downloadResults.push(result);
                    totalDownloadBytes += result.bytesReceived;
                    totalDownloadDuration += result.duration;

                    if (result.speedMbps > 50 && downloadResults.length >= 1) break;
                } catch (error) {
                    console.error(`Download test failed: ${error.message}`);
                }
            }

            if (downloadResults.length > 0) {
                const avgDownloadSpeed = downloadResults.reduce((sum, r) => sum + r.speedMbps, 0) / downloadResults.length;
                testResults.speeds.download.bandwidth = parseFloat((avgDownloadSpeed * 1000000 / 8).toFixed(0));
                testResults.speeds.download.bytes = totalDownloadBytes;
                testResults.speeds.download.elapsed = parseFloat((totalDownloadDuration * 1000).toFixed(0));
            }

            // Test upload speed
            const uploadResults = [];
            let totalUploadBytes = 0;
            let totalUploadDuration = 0;

            for (let i = 0; i < Math.min(2, this.testFileUrls.upload.length); i++) {
                const testConfig = this.testFileUrls.upload[i];
                try {
                    const result = await this.testUploadSpeedWithProgress(testConfig.url, testConfig.size, 8000);
                    uploadResults.push(result);
                    totalUploadBytes += result.bytesSent;
                    totalUploadDuration += result.duration;

                    if (result.speedMbps > 30 && uploadResults.length >= 1) break;
                } catch (error) {
                    console.error(`Upload test failed: ${error.message}`);
                }
            }

            if (uploadResults.length > 0) {
                const avgUploadSpeed = uploadResults.reduce((sum, r) => sum + r.speedMbps, 0) / uploadResults.length;
                testResults.speeds.upload.bandwidth = parseFloat((avgUploadSpeed * 1000000 / 8).toFixed(0));
                testResults.speeds.upload.bytes = totalUploadBytes;
                testResults.speeds.upload.elapsed = parseFloat((totalUploadDuration * 1000).toFixed(0));
            }

            // Format final results
            return {
                type: 'result',
                timestamp: testResults.timestamp,
                ping: {
                    jitter: testResults.ping.max && testResults.ping.min
                        ? parseFloat(((testResults.ping.max - testResults.ping.min) / 2).toFixed(2))
                        : null,
                    latency: testResults.ping.latency,
                    low: testResults.ping.min,
                    high: testResults.ping.max
                },
                download: {
                    bandwidth: testResults.speeds.download.bandwidth,
                    bytes: testResults.speeds.download.bytes,
                    elapsed: testResults.speeds.download.elapsed,
                    mbps: testResults.speeds.download.bandwidth
                        ? parseFloat((testResults.speeds.download.bandwidth * 8 / 1000000).toFixed(2))
                        : 0
                },
                upload: {
                    bandwidth: testResults.speeds.upload.bandwidth,
                    bytes: testResults.speeds.upload.bytes,
                    elapsed: testResults.speeds.upload.elapsed,
                    mbps: testResults.speeds.upload.bandwidth
                        ? parseFloat((testResults.speeds.upload.bandwidth * 8 / 1000000).toFixed(2))
                        : 0
                },
                client: testResults.client,
                isp: testResults.isp,
                server: testResults.server
            };

        } catch (error) {
            throw new Error(`Speed test failed: ${error.message}`);
        }
    }

    // Keep the original runTest method for backward compatibility
    async runTest() {
        return this.runTestWithProgress();
    }
}

module.exports = { SimpleSpeedTest };
