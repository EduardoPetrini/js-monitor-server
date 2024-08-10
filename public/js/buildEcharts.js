const chartData = {
  categories: [],
  heapTotal: [],
  heapUsed: [],
  rss: [],
  arrayBuffers: [],
  external: [],
  system: [],
  user: [],
};
function buildEcharts() {
  const memChart = echarts.init(document.getElementById('memChart'), 'dark');
  const cpuChart = echarts.init(document.getElementById('cpuChart'), 'dark');

  const commonLineOptions = {
    smooth: true,
    type: 'line',

    symbolSize: 0,
    endLabel: {
      show: true,
      formatter: function (params) {
        return params.seriesName + ': ' + params.value;
      },
    },
  };

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
    series: [
      {
        name: 'Heap Total',
        data: [],
        itemStyle: {
          color: '#ffa600',
        },
        areaStyle: {
          color: '#ffa600',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
      {
        name: 'Heap Used',
        data: [],
        itemStyle: {
          color: '#ff6361',
        },
        areaStyle: {
          color: '#ff6361',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
      {
        name: 'RSS',
        data: [],
        itemStyle: {
          color: '#bc5090',
        },
        areaStyle: {
          color: '#bc5090',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
      {
        name: 'Array Buffers',
        data: [],
        itemStyle: {
          color: '#58508d',
        },
        areaStyle: {
          color: '#58508d',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
      {
        name: 'External',
        data: [],
        itemStyle: {
          color: '#003f5c',
        },
        areaStyle: {
          color: '#003f5c',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
    ],
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
    series: [
      {
        name: 'User',
        data: [],
        itemStyle: {
          color: '#ffa600',
        },
        areaStyle: {
          color: '#ffa600',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
      {
        name: 'System',
        data: [],
        itemStyle: {
          color: '#ff6361',
        },
        areaStyle: {
          color: '#ff6361',
          opacity: 0.5,
        },
        ...commonLineOptions,
      },
    ],
  };

  memChart.setOption(memOptions);
  cpuChart.setOption(cpuOptions);

  return { memChart, cpuChart };
}

function updateEcharts(data, memChart, cpuChart, index) {
  const { heapTotal, heapUsed, rss, arrayBuffers, external, system, user } = data;
  chartData.categories.push(index);
  chartData.heapTotal.push(heapTotal);
  chartData.heapUsed.push(heapUsed);
  chartData.rss.push(rss);
  chartData.arrayBuffers.push(arrayBuffers);
  chartData.external.push(external);
  chartData.system.push(system);
  chartData.user.push(user);

  if (index > 5000) {
    chartData.categories.shift();
    chartData.heapTotal.shift();
    chartData.heapUsed.shift();
    chartData.rss.shift();
    chartData.arrayBuffers.shift();
    chartData.external.shift();
    chartData.system.shift();
    chartData.user.shift();
  }

  memChart.setOption({
    xAxis: {
      data: chartData.categories,
    },
    series: [
      {
        name: 'Heap Total',
        data: chartData.heapTotal,
      },
      {
        name: 'Heap Used',
        data: chartData.heapUsed,
      },
      {
        name: 'RSS',
        data: chartData.rss,
      },
      {
        name: 'Array Buffers',
        data: chartData.arrayBuffers,
      },
      {
        name: 'External',
        data: chartData.external,
      },
    ],
  });

  cpuChart.setOption({
    xAxis: {
      data: chartData.categories,
    },
    series: [
      {
        name: 'System',
        data: chartData.system,
      },
      {
        name: 'User',
        data: chartData.user,
      },
    ],
  });
}
