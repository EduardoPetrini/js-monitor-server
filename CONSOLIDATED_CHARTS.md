# Consolidated Charts for Standalone Mode

## Summary of Changes

I've successfully updated the JS Monitor Server to consolidate all Node.js processes into two shared charts in standalone mode, while keeping the local mode unchanged.

## What Changed

### 1. **buildEcharts.js** - New Consolidated Charts Function

- Added `buildConsolidatedCharts()` function that creates two charts showing all processes
- **Memory Chart**: Shows RSS memory for all processes, each as a separate colored line
- **CPU Chart**: Shows User CPU for all processes, each as a separate colored line
- Each process is identified by its name (derived from path or PID)
- Uses different colors for each process line
- Includes scrollable legend for when there are many processes

### 2. **server.js** - Mode Detection Endpoint

- Added `GET /mode` endpoint that returns the current monitor mode (`local` or `standalone`)
- This allows the frontend to know which chart type to use

### 3. **index.html** - Smart Mode Handling

- Fetches the monitor mode on page load
- **Standalone Mode**: Creates a single container with two consolidated charts showing all processes
  - Displays process count in the header
  - All memory data on one chart
  - All CPU data on another chart
- **Local Mode**: Keeps the original behavior with individual charts per process
  - Each process gets its own card with separate memory and CPU charts
  - Shows all Node.js memory statistics (Heap Total, Heap Used, RSS, Array Buffers, External)

## How It Works

### Standalone Mode

1. When the page loads, it fetches the mode from `/mode` endpoint
2. If mode is `standalone`, it creates a single container with consolidated charts
3. On each update, all processes are passed to `consolidatedCharts.update(processes, index)`
4. The function:
   - Tracks each process by PID
   - Maintains separate data arrays for memory and CPU per process
   - Creates a series for each process with a unique color
   - Updates both charts with all process data

### Local Mode

1. Continues to work exactly as before
2. Each process gets its own card with individual charts
3. Shows detailed memory breakdown for the monitored process

## Testing

To test in standalone mode:

```bash
node bin/index.js
```

To test in local mode:

```bash
npm start
# or
node index.js
```

Then open http://localhost:9966 in your browser.

## Benefits

- **Standalone Mode**: Easy comparison of all Node.js processes at a glance
- **Local Mode**: Detailed monitoring of a single process with full memory breakdown
- **Clean separation**: Each mode has its own optimized visualization
- **Performance**: Efficient data management with 100-point sliding window
