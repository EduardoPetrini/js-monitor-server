# JS Resources Monitor

A real-time monitoring tool for JavaScript applications that tracks CPU usage and memory consumption.

![JS Monitor Server](https://github.com/EduardoPetrini/js-monitor-server/blob/f69ad90921e73cf2f5d2c0a69fbc8b3ba0c2d5bd/docs/ss.png?raw=true)

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time monitoring of CPU usage and memory consumption
- Web-based UI for easy visualization
- Customizable monitoring interval
- WebSocket communication for live updates

## Prerequisites

- Node.js (version 12 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Install the `js-monitor-server` as dependency of your application:
   ```
   npm install js-monitor-server@latest
   ```



## Usage

1. Import the library as dependency of your nodejs app. 
   ```javascript
   import 'js-monitor-server'
   ```

2. The default web server port is `9966`. You can change it by changing the `MONITOR_PORT` environment variable in the `.env` file.

3. Open a web browser and navigate to [http://localhost:9966](http://localhost:9966) (or the port specified in your environment variables).

4. The UI will display real-time CPU and memory usage of the monitored process.

## File Structure

- `index.js`: Entry point of the application
- `server.js`: Sets up the Express server and Socket.io
- `monitor.js`: Contains the `Monitor` class for tracking system resources
- `public/index.html`: The frontend UI for displaying monitoring data

## How It Works

1. The `Monitor` class in `monitor.js` uses Node.js's `process.cpuUsage()` and `process.memoryUsage()` to collect system resource data.
2. The Express server in `server.js` serves the frontend and sets up WebSocket communication using Socket.io.
3. The frontend (`index.html`) receives real-time updates via WebSocket and displays the data using charts (implementation not shown in the provided code).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
