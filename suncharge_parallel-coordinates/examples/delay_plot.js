const data = {
    labels: ['Antwerp', 'Birmingham', 'Göteborg', 'Lyon', 'Wrocław'], // Example plant keys
    datasets: [
        {
            label: 'Delayed Home Battery (%)',
            data: [13.55, 13.05, 13.33, 11.24, 13.94], // Example data for MaterialKey 1
            backgroundColor:  'red',
            stack: 'Home Battery'
        },
        {
            label: 'On Time Home Battery (%)',
            data: [86.45, 86.95, 86.67, 88.76, 86.05], // Example data for MaterialKey 1
            backgroundColor: 'green',
            stack: 'Home Battery'
        },
        {
            label: 'Delayed EV Car Battery (%)',
            data: [13.857229, 13.52, 13.81, 5.55, 13.97], // Example data for MaterialKey 1
            backgroundColor: 'red',
            stack: 'EV Car Battery'
        },
        {
            label: 'On Time Car Battery (%)',
            data: [86.14, 86.47, 86.18, 94.44, 86.02], // Example data for MaterialKey 1
            backgroundColor: 'green',
            stack: 'EV Car Battery'
        }
    ]
};


const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            x: {
                stacked: false
            },
            y: {
                stacked: true,
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.dataset.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                    }
                }
            }
        }
    }
};

let myChart = new Chart(document.getElementById('myChart'), config);

function updateChart(stackName) {
    myChart.destroy();
    const filteredData = data.datasets.filter(dataset => dataset.stack === stackName);
    const newConfig = { ...config, data: { ...data, datasets: filteredData } };
    myChart = new Chart(document.getElementById('myChart'), newConfig);
}