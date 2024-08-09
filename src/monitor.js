import EventEmitter from 'events';
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
      clearInterval(this.currentInterval);
    }
  }

  startMonitor() {
    this.stopMonitor();
    let previousCpu = process.cpuUsage();

    const details = { name: process.env.INIT_CWD };
    this.currentInterval = setInterval(() => {
      const { heapTotal, heapUsed, rss, arrayBuffers, external } = process.memoryUsage();
      previousCpu = process.cpuUsage(previousCpu);

      const heapTotalMb = toMb(heapTotal);
      const heapUsedMb = toMb(heapUsed);
      const rssMb = toMb(rss);
      const arrayBuffersMb = toMb(arrayBuffers);
      const externalMb = toMb(external);

      this.emit('update', { ...previousCpu, heapTotal: heapTotalMb, heapUsed: heapUsedMb, rss: rssMb, arrayBuffers: arrayBuffersMb, external: externalMb, details });
    }, this.intervalMs);
  }
}
