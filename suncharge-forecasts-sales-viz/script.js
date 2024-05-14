// Generating the matrix



const matrixContainer = document.getElementById('matrix');

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 12; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        matrixContainer.appendChild(cell);
    }
}

// Generating the month labels
const monthLabelsContainer = document.querySelector('.month-labels');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

months.forEach(month => {
    const monthLabel = document.createElement('div');
    monthLabel.textContent = month;
    monthLabel.classList.add('month-label');
    monthLabelsContainer.appendChild(monthLabel);
});

// Generating the plant labels
const plantLabelsContainer = document.querySelector('.row-labels');
const plants = ['Antwerp', 'Wroclaw', 'Lyon', 'Birmingham', 'Goteborg'];

plants.forEach(plant => {
    const plantLabel = document.createElement('div');
    plantLabel.textContent = plant;
    plantLabel.classList.add('row-label');
    plantLabelsContainer.appendChild(plantLabel);
});

// Changing the years
const yearButtons = document.querySelectorAll('.year-button');

yearButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentYear = parseInt(button.textContent);

        console.log('Current year set to:', currentYear);

        yearButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        updateQuantitySalesText(currentYear, currentMaterialKey, currentPlantKey, currentMonth);
        checkdata(currentMaterialKey, currentPlantKey, currentYear);
        colorCells();
    });
});

// Changing the battery type
const batteryButtons = document.querySelectorAll('.battery-button');

batteryButtons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('Current MaterialKey set to:', button.textContent);

        if (button.textContent === 'EV Car Battery') {
            currentMaterialKey = 1;
        } else if (button.textContent === 'Home Battery') {
            currentMaterialKey = 2;
        }

        batteryButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        updateQuantitySalesText(currentYear, currentMaterialKey, currentPlantKey, currentMonth);
        checkdata(currentMaterialKey, currentPlantKey, currentYear);
        colorCells();
    });
});

// Changing Plant and Month
const cells = document.querySelectorAll('.cell');

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        console.log('Cell Clicked:', cell.textContent);

        const row = Math.floor(index / 12) + 1; // Calculate row index (1-based)
        const column = (index % 12) + 1; // Calculate column index (1-based)

        const currentPlantKey = row + 3;
        const currentMonth = column;

        console.log('Current PlantKey set to:', currentPlantKey);
        console.log('Current Month set to:', currentMonth);

        cells.forEach(cell => {
            cell.classList.remove('active');
        });
        cell.classList.add('active');

        updateQuantitySalesText(currentYear, currentMaterialKey, currentPlantKey, currentMonth);
        checkdata(currentMaterialKey, currentPlantKey, currentYear);
        colorCells();
    });
});


// CSV FILE

// Upload data
const csvData = [];

const plantMapping = {
    4: 'Antwerp',
    5: 'Wroclaw',
    6: 'Lyon',
    7: 'Birmingham',
    8: 'Goteborg'
};

const materialMapping = {
    1: 'EV Car Battery',
    2: 'Home Battery'
};


// Update text
function updateQuantitySalesText(currentYear, currentMaterialKey, currentPlantKey, currentMonth) {
    const filteredData = csvData.filter(row => {
        return row.Year == currentYear && row.MaterialKey == currentMaterialKey && row.PlantKey == currentPlantKey;
    });

    const plantName = plantMapping[currentPlantKey];
    const materialName = materialMapping[currentMaterialKey];


    const quantitySalesText = document.querySelector('.quantitySalesText');

    quantitySalesText.innerHTML = `${currentYear}<br>${materialName}<br>${plantName} DC`;
}

function colorCells() {
    // Filter data for selected year and material key
    const filteredData = csvData.filter(row => {
        return row.Year == currentYear && row.MaterialKey == currentMaterialKey;
    });

    console.log("Filtered Data:", filteredData);

    // Calculate minimum and maximum of QuantitySales column
    const minQuantitySales = Math.min(...filteredData.map(row => parseInt(row.QuantitySales)));
    const maxQuantitySales = Math.max(...filteredData.map(row => parseInt(row.QuantitySales)));

    console.log("Min QuantitySales:", minQuantitySales);
    console.log("Max QuantitySales:", maxQuantitySales);

    // Select all cells
    const cells = document.querySelectorAll('.cell');

    // Color cells based on QuantitySales value
    cells.forEach((cell, index) => {
        const nrow = Math.floor(index / 12) + 1;
        const ncolumn = (index % 12) + 1;

        const quantitySales = filteredData.find(row => row.Month == ncolumn && row.PlantKey == (nrow + 3))?.QuantitySales || 0;

        console.log(`Cell [${nrow},${ncolumn}]: QuantitySales = ${quantitySales}`);

        // Calculate alpha value
        const alpha = (quantitySales - minQuantitySales) / maxQuantitySales;

        console.log(`Alpha for Cell [${nrow},${ncolumn}]: ${alpha}`);

        // Set cell color with alpha
        cell.style.backgroundColor = `rgba(30, 144, 255, ${alpha})`;
    });
}


// Define a function to parse the CSV file
function parseCSVFile(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
            csvData.length = 0; // Clear previous data
            csvData.push(...result.data); // Store new data
            console.log(csvData);
        }
    });
}

// Trigger CSV parsing when the page loads
window.addEventListener('load', () => {
    // Fetch the CSV file (assuming it's named 'data.csv')
    fetch('data.csv')
        .then(response => response.blob())
        .then(blob => {
            // Parse the CSV file once it's fetched
            parseCSVFile(blob);
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV file:', error);
        });
});



function checkdata(mkey, pkey, year) {

    d3.select("#my_dataviz").html("");
    var margin = { top: 100, right: 0, bottom: 0, left: 0 },
        width = 460 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom,
        innerRadius = 120,
        outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object

    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    d3.csv("data.csv").then(function (data) {
        data = data.filter(function (d) {
            return d.Year == year && d.MaterialKey == mkey && d.PlantKey == pkey;
        });


        // Convert data values to numbers
        data.forEach(function (d) {
            d.Difference = +d.Difference;
        });

        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(data.map(function (d) { return d.Month; }));

        var monthTotals = {};
        data.forEach(function (d) {
            if (!monthTotals[d.Month]) {
                monthTotals[d.Month] = 0;
            }
            monthTotals[d.Month] += d.Difference;
        });

        // Y scale for both series
        var y = d3.scaleLinear()
            .range([innerRadius, 30])
            .domain([d3.min(data, function (d) { return d.Difference; }), d3.max(data, function (d) { return d.Difference; })]); // Domain of Y is from min to max difference

        // Add the bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", function (d) { return monthTotals[d.Month] >= 0 ? "forestgreen" : "crimson"; })
            .attr("d", d3.arc()
                .innerRadius(function (d) { return innerRadius; })
                .outerRadius(function (d) { return y(Math.abs(monthTotals[d.Month])); })
                .startAngle(function (d) { return x(d.Month); })
                .endAngle(function (d) { return x(d.Month) + x.bandwidth(); })
                .padAngle(0.1)
                .padRadius(innerRadius));

        // Add the labels
        svg.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("dy", "0.35em")
            .attr("transform", function (d) { return "rotate(" + ((x(d.Month) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (innerRadius + (outerRadius - innerRadius) / 2) + ",0)"; })
            .attr("text-anchor", "middle")
            .text(function (d) { return d.Month; });

    });
}