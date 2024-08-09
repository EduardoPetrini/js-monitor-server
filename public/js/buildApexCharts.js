function buildApexCharts() {
  const memCtx = document.querySelector('#memChart');
  const cpuCtx = document.querySelector('#cpuChart');

  const options = {
    chart: {
      type: 'line',
      id: 'realtime',
      height: 350,
      foreColor: 'rgb(216, 211, 200)',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 1,
    },

    markers: {
      size: 0,
    },
    legend: {
      show: true,
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: 'dark',
      followCursor: true,
    },
  };

  const memOptions = {
    series: [
      {
        id: 'heapTotal',
        name: 'Heap Total',
        data: [],
      },
      {
        id: 'heapUsed',
        name: 'Heap Used',
        data: [],
      },
      {
        id: 'rss',
        name: 'RSS',
        data: [],
      },
      {
        id: 'arrayBuffers',
        name: 'Array Buffers',
        data: [],
      },
      {
        id: 'external',
        name: 'External',
        data: [],
      },
    ],
    title: {
      text: 'Memory',
      align: 'Center',
    },
    ...options,
  };

  const cpuOptions = {
    series: [
      {
        id: 'user',
        name: 'User Total',
        data: [],
      },
      {
        id: 'system',
        name: 'System',
        data: [],
      },
    ],
    title: {
      text: 'CPU',
      align: 'Center',
    },
    ...options,
  };

  const memChart = new ApexCharts(memCtx, memOptions);
  const cpuChart = new ApexCharts(cpuCtx, cpuOptions);

  memChart.render();
  cpuChart.render();

  return { memChart, cpuChart };
}

function updateApexCharts(data, memChart, cpuChart, index) {
  const { heapTotal, heapUsed, rss, arrayBuffers, external, user, system } = data;

  memChart.appendData([
    {
      data: [heapTotal],
    },
    {
      data: [heapUsed],
    },
    {
      data: [rss],
    },
    {
      data: [arrayBuffers],
    },
    {
      data: [external],
    },
  ]);

  cpuChart.appendData([
    {
      data: [user],
    },
    {
      data: [system],
    },
  ]);
}
