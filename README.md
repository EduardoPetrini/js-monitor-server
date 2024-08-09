# JS Resources Monitor

A real-time monitoring tool for JavaScript applications that tracks CPU usage and memory consumption.

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

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/js-resources-monitor.git
   ```

2. Navigate to the project directory:
   ```
   cd js-resources-monitor
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Open a web browser and navigate to `http://localhost:3000` (or the port specified in your environment variables).

3. The UI will display real-time CPU and memory usage of the monitored process.

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
