# SpeedMeter


## Folder Structure
```text
speedmeter/
├── server.js
├── templates/
│   ├── index.html
│   └── /
└── /
```

## Prerequisites

Use the ```npm init``` command to create a ```package.json``` file for our project.

```text
mkdir node.js
cd node.js
npm init -y /* For auto add the required field */
```

## Install dependencies
```shell
npm install express
npm install speed-test
npm install speed-test --global
```


## Check Installed Modules
```shell
npm list
```


## Run the web app
```shell
node server.js
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
```shell
python -m certifi
```


## Run the program
```shell
python speedmeter/main.py 
````

- Response:
```text
Testing internet speed...
Finding the best server...

--- Speed Test Results ---
Download Speed: 129.96 Mbps
Upload Speed: 168.04 Mbps
```


