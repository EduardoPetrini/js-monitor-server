function buildChartJs() {
  const memCtx = document.getElementById('memChart');
  const cpuCtx = document.getElementById('cpuChart');

  const chartOptions = {
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeOutCubic',
      y: { duration: 0 },
    },
    responsive: true,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
        fill: true,
        borderWidth: 1,
      },
      point: {
        radius: 0,
      },
    },
  };

  const memChart = new Chart(memCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          id: 'heapTotal',
          label: 'Heap Total',
          data: [],
        },
        {
          id: 'heapUsed',
          label: 'Heap Used',
          data: [],
        },
        {
          id: 'rss',
          label: 'RSS',
          data: [],
        },
        {
          id: 'arrayBuffers',
          label: 'Array Buffers',
          data: [],
        },
        {
          id: 'external',
          label: 'External',
          data: [],
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        title: {
          display: true,
          text: 'Memory Consumption',
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'MB',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Timeline',
          },
        },
      },
    },
  });

  const cpuChart = new Chart(cpuCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          id: 'user',
          label: 'User Total',
          data: [],
        },
        {
          id: 'system',
          label: 'System',
          data: [],
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        title: {
          display: true,
          text: 'CPU Consumption',
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'MS',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Timeline',
          },
        },
      },
    },
  });

  return { memChart, cpuChart };
}

function updateChartJs(data, memChart, cpuChart, index) {
  const isTooBig = index > 2000 ? true : false;

  memChart.data.labels.push(index);
  if (isTooBig) memChart.data.labels.shift();

  memChart.data.datasets.forEach(dataset => {
    const value = data[dataset.id];
    dataset.data.push(value);
    if (isTooBig) dataset.data.shift();
  });

  cpuChart.data.labels.push(index);
  if (isTooBig) cpuChart.data.labels.shift();

  cpuChart.data.datasets.forEach(dataset => {
    const value = data[dataset.id];
    dataset.data.push(value);
    if (isTooBig) dataset.data.shift();
  });

  memChart.update();
  cpuChart.update();
}
