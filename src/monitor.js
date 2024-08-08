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

    this.currentInterval = setInterval(() => {
      const { heapTotal, heapUsed, rss, arrayBuffers, external } = process.memoryUsage();
      const details = process.execArgv;

      const heapTotalMb = toMb(heapTotal);
      const heapUsedMb = toMb(heapUsed);
      const rssMb = toMb(rss);
      const arrayBuffersMb = toMb(arrayBuffers);
      const externalMb = toMb(external);

      this.emit('update', { heapTotal: heapTotalMb, heapUsed: heapUsedMb, rss: rssMb, arrayBuffers: arrayBuffersMb, external: externalMb, details });
    }, this.intervalMs);
  }
}
