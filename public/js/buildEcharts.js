const chartData = {
  categories: [],
};

const colorIndex = ['#ffa600', '#ff6361', '#bc5090', '#58508d', '#003f5c'];

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

function buildEcharts() {
  const memChart = echarts.init(document.getElementById('memChart'), 'dark');
  const cpuChart = echarts.init(document.getElementById('cpuChart'), 'dark');

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

  return { memChart, cpuChart };
}

function updateEcharts(data, memChart, cpuChart, index) {
  const { memory, cpu } = data;
  Object.entries({ ...memory, ...cpu }).forEach(([key, value]) => {
    if (!chartData[key]) {
      chartData[key] = [];
    }
    chartData[key].push(value);
  });
  chartData.categories.push(index);

  if (index > 5000) {
    Object.keys(chartData).forEach(key => chartData[key].shift());
  }

  memChart.setOption({
    xAxis: {
      data: chartData.categories,
    },
    series: Object.keys(memory).map((key, index) => ({
      name: key,
      data: chartData[key],
      itemStyle: {
        color: colorIndex[index],
      },
      areaStyle: {
        color: colorIndex[index],
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
        color: colorIndex[index],
      },
      areaStyle: {
        color: colorIndex[index],
        opacity: 0.5,
      },
      ...commonLineOptions,
    })),
  });
}

function resetEcharts() {
  Object.keys(chartData).forEach(key => (chartData[key] = []));
}
