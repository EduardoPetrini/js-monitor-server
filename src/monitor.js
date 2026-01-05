import EventEmitter from 'events';
import pidusage from 'pidusage';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const findModule = require('find-process');
const find = typeof findModule === 'function' ? findModule : findModule.default;
import { logger } from './logger.js';
import { toMb } from './genericFunctions.js';

export class Monitor extends EventEmitter {
  constructor(intervalMs = 1000, mode = 'local') {
    super();
    this.intervalMs = intervalMs;
    this.mode = mode;
    this.currentInterval = null;
  }

  setInterval(intervalMs) {
    this.intervalMs = intervalMs;
    this.resetMonitor();
  }

  resetMonitor() {
    this.stopMonitor();
    this.startMonitor();
  }

  stopMonitor() {
    if (this.currentInterval) {
      logger.info('Resetting the monitor');
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }

  getLocalStats(previousCpu) {
    const { heapTotal, heapUsed, rss, arrayBuffers, external } = process.memoryUsage();

    // Calculate CPU diff
    // process.cpuUsage(previousCpu) returns the diff since previousCpu
    const cpuDiff = process.cpuUsage(previousCpu);
    // New snapshot for next time is (previousCpu + cpuDiff) ?
    // No, process.cpuUsage() is cumulative.
    // We need the current cumulative value for the NEXT 'previousCpu'.
    // const currentCpuCumulative = process.cpuUsage();
    // But to respect the original logic which tried to just hold the diff?
    // Let's use the standard pattern:
    // start = process.cpuUsage();
    // ...
    // diff = process.cpuUsage(start);
    // start = process.cpuUsage(); // Update baseline

    // However, since we don't have 'currentCpuCumulative' easily without calling it again...
    // Actually `process.cpuUsage()` without args returns current cumulative.
    const currentCpuCumulative = process.cpuUsage();

    const heapTotalMb = toMb(heapTotal);
    const heapUsedMb = toMb(heapUsed);
    const rssMb = toMb(rss);
    const arrayBuffersMb = toMb(arrayBuffers);
    const externalMb = toMb(external);

    return {
      stats: {
        pid: process.pid,
        name: process.env.USER_DEFINED_NAME || process.env.INIT_CWD || process.env.PWD || 'Main Process',
        cpu: { System: cpuDiff.system, User: cpuDiff.user },
        memory: { 'Heap Total': heapTotalMb, 'Heap Used': heapUsedMb, RSS: rssMb, 'Array Buffers': arrayBuffersMb, External: externalMb },
        mainMemory: rssMb,
        mainCpu: cpuDiff.user,
      },
      newCpuSnapshot: currentCpuCumulative,
    };
  }

  startMonitor() {
    this.stopMonitor();
    // Initialize CPU baseline
    let previousCpu = process.cpuUsage();

    logger.info(`Starting the monitor in ${this.mode} mode: ${this.intervalMs}ms`);

    this.currentInterval = setInterval(async () => {
      try {
        const processes = [];

        // Always get local stats as we might need them or just to execute the logic
        const localStatsData = this.getLocalStats(previousCpu);
        previousCpu = localStatsData.newCpuSnapshot;

        if (this.mode === 'local') {
          processes.push(localStatsData.stats);
        } else {
          // Standalone Mode
          try {
            const foundProcesses = await find('name', 'node');
            const pids = foundProcesses.map(p => p.pid);

            if (pids.length > 0) {
              const stats = await pidusage(pids);

              for (const p of foundProcesses) {
                const s = stats[p.pid];
                if (!s) continue;

                if (p.pid === process.pid) {
                  // Merge local details for self
                  processes.push({
                    ...localStatsData.stats,
                    name: 'JS Monitor Server (Self)',
                    isSelf: true,
                  });
                } else {
                  // Try to parse name from cmd
                  // "node /path/to/script.js" -> "script" (parent dir)
                  // Let's find the first arg that ends in .js/mjs/ts/cjs or is not a flag
                  let name = p.cmd;
                  let identifier = p.pid;

                  if (p.cmd) {
                    const parts = p.cmd.split(' ');
                    // Filter out 'node' or flags
                    const scriptPath = parts.find(part => !part.startsWith('-') && (part.endsWith('.js') || part.endsWith('.mjs') || part.endsWith('.ts') || part.endsWith('.cjs') || part.indexOf('/') !== -1 || part.indexOf('\\') !== -1));

                    if (scriptPath) {
                      try {
                        // Get last folder name? Or "path (last folder)"?
                        // User request: "path (last folder) or pid"
                        // Example: /home/user/project/index.js -> project
                        // Example: ./bin/index.js -> bin (or root project name?)
                        // Let's get the directory name containing the script

                        // Standardize delimiters
                        const normalized = scriptPath.replace(/\\/g, '/');
                        const pathParts = normalized.split('/');
                        // Remove filename
                        pathParts.pop();

                        if (pathParts.length > 0) {
                          const lastFolder = pathParts[pathParts.length - 1];
                          if (lastFolder && lastFolder !== '.') {
                            name = lastFolder;
                          } else {
                            // if script is in root (./index.js), maybe use CWD name?
                            // `find-process` doesn't give CWD easily.
                            // Fallback to filename if folder is empty/dot.
                            const filename = normalized.split('/').pop();
                            name = filename;
                          }
                        } else {
                          // Just filename
                          name = normalized;
                        }
                      } catch (e) {
                        /* ignore parsing errors */
                      }
                    }
                  }

                  processes.push({
                    pid: p.pid,
                    name: name || p.name || `PID: ${p.pid}`,

                    cpu: { [`User (${p.pid})`]: s.cpu }, // Unique key for chart line if needed?
                    // Actually, if we want "identify the process on the chart by its path (last folder) or pid"
                    // The chart title is "CPU", the series name is the KEY in the object.
                    // So we should make the key descriptive.

                    memory: { [`RSS (${name || p.pid})`]: toMb(s.memory) },
                    mainMemory: toMb(s.memory), // For the card text
                    mainCpu: s.cpu,
                    details: {
                      elapsed: s.elapsed,
                      timestamp: s.timestamp,
                    },
                  });
                }
              }
            }
          } catch (e) {
            logger.error('Error in standalone monitor cycle', e);
          }
        }

        this.emit('update', processes);
      } catch (err) {
        logger.error(err);
      }
    }, this.intervalMs);
  }
}
