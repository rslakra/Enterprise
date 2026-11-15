# Internet Speed Test UI

A beautiful, real-time internet speed test application with animated speed meters, built with Node.js. Works on macOS (including ARM64/Apple Silicon) and Ubuntu.

## Features

- 🚀 **Real-time Speed Meters**: Animated gauges showing download and upload speeds
- 📊 **Live Charts**: Real-time speed history visualization
- 🌐 **WebSocket Updates**: Live progress updates during testing
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 💻 **Cross-Platform**: Runs on macOS (Intel & Apple Silicon) and Ubuntu
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📈 **Statistics**: Shows ping, jitter, max speeds, and connection info

## Screenshot

The application features:
- Two animated gauge meters for download and upload speeds
- Real-time progress bars and status updates
- Speed history chart
- Connection information display
- Statistics cards for ping, jitter, and max speeds

## Installation

1. Clone or create the project:
```bash
mkdir speedtest-app
cd speedtest-app
```

2. Copy all the files to your project directory

3. Install dependencies:
```bash
npm install
echo "Application is ready! Start the server with: npm start" && ls -la
# npm init -y /* For auto add the required field */
```

## Usage

### Start the Web Application

```bash
npm start
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Run Command-Line Test

```bash
# Regular output
npm test

# JSON output
npm run test:json
```

## How It Works

1. **Backend**: Node.js server with Express and WebSocket support
2. **Speed Testing**: Pure JavaScript implementation (no binary dependencies)
3. **Real-time Updates**: WebSocket connection for live progress updates
4. **UI Updates**: Smooth animations and real-time chart updates

## Architecture

```
speed-test-app/
├── server.js                 # Express + WebSocket server
├── speedtest-core.js         # Core testing logic with progress callbacks
├── standalone-speedtest.js   # CLI version (no server needed)
├── public/
│   ├── index.html            # Beautiful UI with gauges
│   └── js/
│       └── speedtest.js      # Client-side WebSocket handling
└── package.json              # Dependencies
```

## API Endpoints

### WebSocket Connection
- Connect to `ws://localhost:3000`
- Send: `{ type: 'START_TEST' }`
- Receive: Progress updates and final results

### REST API
- `POST /api/speedtest` - Run speed test and get JSON results
- `GET /api/health` - Health check endpoint

## Customization

### Change Test Servers

Edit `speedtest-core.js` to modify test servers:

```javascript
this.testFileUrls = {
  download: [
    { url: 'YOUR_DOWNLOAD_URL', size: FILE_SIZE },
    // Add more URLs
  ],
  upload: [
    { url: 'YOUR_UPLOAD_URL', size: DATA_SIZE },
    // Add more URLs
  ]
};
```

### Modify UI Theme

Edit the CSS in `public/index.html` to change colors:

```css
/* Change gradient colors */
body {
  background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Adjust Gauge Maximum Speed

In `public/js/speedtest.js`, modify:

```javascript
const maxSpeed = 200; // Change max speed for gauge (in Mbps)
```

## Troubleshooting

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to different port
```

### WebSocket Connection Issues
Ensure your firewall allows WebSocket connections on the specified port.

### Slow Test Results
The accuracy depends on:
- Your actual internet connection speed
- Server locations and availability
- Network congestion

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Test on wired connection** for most accurate results
2. **Close other applications** using bandwidth
3. **Test multiple times** for average results
4. **Use local test servers** when available

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

## Credits

Built with:
- Node.js
- Express.js
- WebSocket (ws)
- Chart.js
- Pure CSS animations

---

Made with ❤️ for accurate speed testing on all platforms, including Apple Silicon Macs!

---

## Install certificates command (macOS only)

This is the most common cause on macOS. Starting with Python 3.6, the Python installer includes a separate script to 
install root certificates. If you skipped this step, you will encounter SSL errors.

- Open a Terminal and locate your Python version's directory.
```shell
python3 --version
```


- Run the included ```Install Certificates.command``` file. Replace ```<version>``` with your Python version, e.g., 3.12.
```shell
open /Applications/Python\ <version>/Install\ Certificates.command
```


### On Linux (Debian/Ubuntu): Reinstall your system's CA certificates.
```shell
sudo apt-get update
sudo apt-get install --reinstall ca-certificates
```

### To reference the installed certificate authority (CA) bundle, you can use the built-in function:
```shell
python -m certifi
```
