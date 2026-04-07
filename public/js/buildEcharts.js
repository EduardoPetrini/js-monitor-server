const colorIndex = ['#ffa600', '#ff6361', '#bc5090', '#58508d', '#003f5c'];

const commonLineOptions = {
  smooth: true,
  type: 'line',
  animation: false, // Critical for performance
  symbolSize: 0,
  endLabel: {
    show: true,
    formatter: function (params) {
      return params.seriesName + ': ' + params.value;
    },
  },
};

const colorList = ['#ffa600', '#ff6361', '#bc5090', '#58508d', '#003f5c', '#488f31', '#de425b'];

let lastColorIndex = -1;

function getRandomColor() {
  let index;
  do {
    index = Math.floor(Math.random() * colorList.length);
  } while (index === lastColorIndex);

  lastColorIndex = index;
  return colorList[index];
}

function buildProcessCharts(memEl, cpuEl) {
  const chartColor = getRandomColor();
  const memChart = echarts.init(memEl, 'dark');
  const cpuChart = echarts.init(cpuEl, 'dark');

  const memOptions = {
    title: {
      text: 'Memory',
      align: 'center',
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    backgroundColor: 'rgb(32, 32, 32)',
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      backgroundColor: 'rgba(32, 32, 32, 0.8)',
      axisPointer: {
        type: 'line',
        axis: 'auto',
      },
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    legend: {
      show: true,
    },
    xAxis: {
      data: [],
    },
    yAxis: {},
    series: [],
  };

  const cpuOptions = {
    title: {
      text: 'CPU',
      align: 'center',
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    backgroundColor: 'rgb(32, 32, 32)',
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      backgroundColor: 'rgba(32, 32, 32, 0.8)',
      axisPointer: {
        type: 'line',
        axis: 'auto',
      },
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    legend: {
      show: true,
    },
    xAxis: {
      data: [],
    },
    yAxis: {},
    series: [],
  };

  memChart.setOption(memOptions);
  cpuChart.setOption(cpuOptions);

  const chartData = {
    categories: [],
  };

  return {
    memChart,
    cpuChart,
    update(data, index) {
      const { memory, cpu } = data;
      Object.entries({ ...memory, ...cpu }).forEach(([key, value]) => {
        if (!chartData[key]) {
          chartData[key] = [];
        }
        chartData[key].push(value);
      });
      chartData.categories.push(index);

      if (chartData.categories.length > 100) {
        // Limit window size for performance (Reduced to 100)
        Object.keys(chartData).forEach(key => {
          if (chartData[key].length > 100) chartData[key].shift();
        });
      }

      memChart.setOption({
        xAxis: {
          data: chartData.categories,
        },
        series: Object.keys(memory).map((key, index) => ({
          name: key,
          data: chartData[key],
          itemStyle: {
            color: chartColor,
          },
          areaStyle: {
            color: chartColor,
            opacity: 0.5,
          },
          ...commonLineOptions,
        })),
      });

      cpuChart.setOption({
        xAxis: {
          data: chartData.categories,
        },
        series: Object.keys(cpu).map((key, index) => ({
          name: key,
          data: chartData[key],
          itemStyle: {
            color: chartColor,
          },
          areaStyle: {
            color: chartColor,
            opacity: 0.5,
          },
          ...commonLineOptions,
        })),
      });
    },
    reset() {
      Object.keys(chartData).forEach(key => (chartData[key] = []));
      memChart.setOption({ series: [], xAxis: { data: [] } });
      cpuChart.setOption({ series: [], xAxis: { data: [] } });
    },
    dispose() {
      if (memChart && !memChart.isDisposed()) memChart.dispose();
      if (cpuChart && !cpuChart.isDisposed()) cpuChart.dispose();
    },
  };
}

// Consolidated charts for standalone mode - all processes on same charts
function buildConsolidatedCharts(memEl, cpuEl) {
  const memChart = echarts.init(memEl, 'dark');
  const cpuChart = echarts.init(cpuEl, 'dark');

  const memOptions = {
    title: {
      text: 'Memory (All Processes)',
      align: 'center',
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    backgroundColor: 'rgb(32, 32, 32)',
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      backgroundColor: 'rgba(32, 32, 32, 0.8)',
      axisPointer: {
        type: 'line',
        axis: 'auto',
      },
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    legend: {
      show: true,
      type: 'scroll',
    },
    xAxis: {
      data: [],
    },
    yAxis: {
      name: 'MB',
    },
    series: [],
  };

  const cpuOptions = {
    title: {
      text: 'CPU (All Processes)',
      align: 'center',
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    backgroundColor: 'rgb(32, 32, 32)',
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
      show: true,
      backgroundColor: 'rgba(32, 32, 32, 0.8)',
      axisPointer: {
        type: 'line',
        axis: 'auto',
      },
      textStyle: {
        color: 'rgb(216, 211, 200)',
      },
    },
    legend: {
      show: true,
      type: 'scroll',
    },
    xAxis: {
      data: [],
    },
    yAxis: {
      name: '%',
    },
    series: [],
  };

  memChart.setOption(memOptions);
  cpuChart.setOption(cpuOptions);

  const chartData = {
    categories: [],
    processes: {}, // pid -> { name, memData: [], cpuData: [] }
  };

  return {
    memChart,
    cpuChart,
    update(processes, index) {
      // processes is an array of process data
      chartData.categories.push(index);

      // Update data for each process
      processes.forEach(proc => {
        const pid = proc.pid || 'local';

        if (!chartData.processes[pid]) {
          chartData.processes[pid] = {
            name: proc.name || `PID: ${pid}`,
            memData: [],
            cpuData: [],
          };
        }

        const procData = chartData.processes[pid];

        // Add memory data (RSS)
        procData.memData.push(proc.mainMemory || 0);

        // Add CPU data (User CPU)
        procData.cpuData.push(proc.mainCpu || 0);
      });

      // Limit window size for performance
      if (chartData.categories.length > 100) {
        chartData.categories.shift();
        Object.values(chartData.processes).forEach(procData => {
          if (procData.memData.length > 100) procData.memData.shift();
          if (procData.cpuData.length > 100) procData.cpuData.shift();
        });
      }

      // Build memory series
      const memSeries = Object.entries(chartData.processes).map(([pid, procData], idx) => ({
        name: procData.name,
        data: procData.memData,
        itemStyle: {
          color: colorList[idx % colorList.length],
        },
        ...commonLineOptions,
      }));

      // Build CPU series
      const cpuSeries = Object.entries(chartData.processes).map(([pid, procData], idx) => ({
        name: procData.name,
        data: procData.cpuData,
        itemStyle: {
          color: colorList[idx % colorList.length],
        },
        ...commonLineOptions,
      }));

      memChart.setOption({
        xAxis: {
          data: chartData.categories,
        },
        series: memSeries,
      });

      cpuChart.setOption({
        xAxis: {
          data: chartData.categories,
        },
        series: cpuSeries,
      });
    },
    reset() {
      chartData.categories = [];
      chartData.processes = {};
      memChart.setOption({ series: [], xAxis: { data: [] } });
      cpuChart.setOption({ series: [], xAxis: { data: [] } });
    },
    dispose() {
      if (memChart && !memChart.isDisposed()) memChart.dispose();
      if (cpuChart && !cpuChart.isDisposed()) cpuChart.dispose();
    },
  };
}
