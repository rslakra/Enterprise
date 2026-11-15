# SpeedMeter - Python Version

An internet speed testing and monitoring solution for measuring network performance.

## 📊 Overview

This project aims to provide a comprehensive solution for testing and monitoring internet connection speeds, including:

- **Download Speed**: Measure download bandwidth
- **Upload Speed**: Measure upload bandwidth  
- **Latency**: Measure connection latency and ping times
- **Jitter**: Measure network stability
- **Historical Tracking**: Store and analyze speed test results over time



## Folder Structure
```text
speedmeter/
├── Python/
│   ├── templates/
│   │   ├── index.html              # The web client
│   │   ├── results.html
│   │   └── /
│   ├── __init__.py
│   ├── app.py
│   ├── main.py
│   ├── README.md
│   ├── requirements.txt
│   └── /
└── /
```

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
> python -m certifi

## Run Flask Application
> python -m flask --app app run --port 8080 --debug

### Web App URL
> http://127.0.0.1:8080 

![Speedtest Start](./../Screenshots/speedtest-start.png)

![Speedtest Results](./../Screenshots/speedtest-results.png)


## Run Application
> python main.py 


- Response:
```text
Testing internet speed...
Finding the best server...

--- Speed Test Results ---
Download Speed: 129.96 Mbps
Upload Speed: 168.04 Mbps
```


## 🚧 Status

**Currently in development** - This project is in the planning/early development phase.

## 🎯 Planned Features

### Core Functionality
- Real-time speed testing
- Multiple test server support
- Configurable test parameters (duration, packet size, etc.)
- Multi-threaded/concurrent connection testing

### Monitoring & Reporting
- Historical data storage
- Performance graphs and visualizations
- Scheduled/automated testing
- Alert system for performance degradation

### Deployment Options
- Standalone CLI tool
- Web-based dashboard
- Docker containerization
- REST API for integration

## 🔧 Planned Technology Stack

(To be determined based on requirements)

Potential technologies:
- **Backend**: Python/Go for speed testing engine
- **Frontend**: React/Vue.js for dashboard
- **Database**: PostgreSQL/InfluxDB for time-series data
- **Containerization**: Docker & Docker Compose

## 📋 Roadmap

- [ ] Define technical requirements
- [ ] Design architecture and data models
- [ ] Implement core speed testing engine
- [ ] Create CLI interface
- [ ] Build web dashboard
- [ ] Add historical tracking
- [ ] Implement alerting system
- [ ] Docker containerization
- [ ] Documentation and testing

## 🤝 Contributing

This project is in early stages. Contributions, ideas, and feedback are welcome!

## 📄 License

This project is open source and available under the MIT License.

---

**Note:** This project is part of the VDI Platform POC repository. See the main [README](../README.md) for other projects.
