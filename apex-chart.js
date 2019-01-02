// charts options
const options = {
    chart: {
        height: 450,
        width: '100%',
        type: 'bar',
        background: '#D3D3D3',
        foreColor: 'black'
    },
    series: [{
        name: 'Motions',
        data: [5069499, 1230003, 8990000, 4500000, 7800000, 9500000, 2350000, 6500000, 1200500, 2460222]
    }],
    xaxis: {
        categories: ['New York', 'Los Angeles', 'Chicago', 'Seattle', 'Melbourne', 'Detroit',
        'London', 'Sidney', 'Copenhagen']
    }
}

// init chart
const chart = new ApexCharts(document.querySelector('#chart'), options);

// render chart
chart.render();

