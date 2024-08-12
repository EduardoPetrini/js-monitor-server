import EventEmitter from 'events';
import { logger } from './logger.js';
import { toMb } from './genericFunctions.js';

export class Monitor extends EventEmitter {
  constructor(intervalMs = 1000) {
    super();
    this.intervalMs = intervalMs;
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
    }
  }

  startMonitor() {
    this.stopMonitor();
    let previousCpu = process.cpuUsage();
    logger.info('Starting the monitor: ' + this.intervalMs);

    const details = { name: process.env.INIT_CWD || process.env.PWD };
    this.currentInterval = setInterval(() => {
      const { heapTotal, heapUsed, rss, arrayBuffers, external } = process.memoryUsage();
      previousCpu = process.cpuUsage(previousCpu);

      const heapTotalMb = toMb(heapTotal);
      const heapUsedMb = toMb(heapUsed);
      const rssMb = toMb(rss);
      const arrayBuffersMb = toMb(arrayBuffers);
      const externalMb = toMb(external);

      this.emit('update', {
        cpu: { System: previousCpu.system, User: previousCpu.user },
        memory: { 'Heap Total': heapTotalMb, 'Heap Used': heapUsedMb, RSS: rssMb, 'Array Buffers': arrayBuffersMb, External: externalMb },
        mainMemory: rssMb,
        mainCpu: previousCpu.user,
        details,
      });
    }, this.intervalMs);
  }
}
