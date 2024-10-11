// import 'chartjs-plugin-annotation';

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.club-button');
    const rows = document.querySelectorAll('tbody tr');
    const ctx = document.getElementById('scatterPlot').getContext('2d');
    const xAxisSelect = document.getElementById('x-axis');
    const yAxisSelect = document.getElementById('y-axis');
    const dataPointCount = document.getElementById('data-point-count');

    // Initialize scatter plot
    const scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: []
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Carry Distance Range'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Distance Range'
                    }
                }
            }
        }
    });

    function updateChart(club) {
        const xAxis = xAxisSelect.value;
        const yAxis = yAxisSelect.value;
        const data = [];
        let dataPointCounter = 1;
    
        rows.forEach(row => {
            if (row.getAttribute('data-club') === club) {
                row.style.display = '';
                data.push({
                    x: xAxis === 'data_point' ? dataPointCounter++ : parseFloat(row.querySelector(`td:nth-child(${getColumnIndex(xAxis)})`).innerText),
                    y: parseFloat(row.querySelector(`td:nth-child(${getColumnIndex(yAxis)})`).innerText)
                });
            } else {
                row.style.display = 'none';
            }
        });
    
        // Calculate average and top percentiles
        const yValues = data.map(point => point.y);
        const average = yValues.reduce((a, b) => a + b, 0) / yValues.length;
        yValues.sort((a, b) => b - a); // Sort in descending order
    
        const top10Values = yValues.slice(0, Math.ceil(yValues.length * 0.1));
        const top25Values = yValues.slice(0, Math.ceil(yValues.length * 0.25));
        const top50Values = yValues.slice(0, Math.ceil(yValues.length * 0.5));
        const top75Values = yValues.slice(0, Math.ceil(yValues.length * 0.75));
    
        const top10Average = top10Values.reduce((a, b) => a + b, 0) / top10Values.length;
        const top25Average = top25Values.reduce((a, b) => a + b, 0) / top25Values.length;
        const top50Average = top50Values.reduce((a, b) => a + b, 0) / top50Values.length;
        const top75Average = top75Values.reduce((a, b) => a + b, 0) / top75Values.length;
    
        // Calculate 95% and 105% of the average
        const rangeMin = average * 0.95;
        const rangeMax = average * 1.05;
    
        scatterChart.data.datasets = [{
            label: club,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }];
    
        scatterChart.options.scales.x.title.text = xAxis.replace(/_/g, ' ');
        scatterChart.options.scales.y.title.text = yAxis.replace(/_/g, ' ');
    
        // Add annotation for the highlighted region
        scatterChart.options.plugins = {
            annotation: {
                annotations: {
                    box1: {
                        type: 'box',
                        yScaleID: 'y',
                        yMin: rangeMin,
                        yMax: rangeMax,
                        backgroundColor: 'rgba(255, 99, 132, 0.25)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }
                }
            }
        };
    
        // Add average line dataset
        const averageLine = {
            label: 'Average',
            data: [{ x: 0, y: average }, { x: Math.max(...data.map(point => point.x)), y: average }],
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderDash: [5, 5]
        };
    
        scatterChart.data.datasets.push(averageLine);

        // Add top 10%, 25%, 50%, 75% average line datasets
        const top10Line = {
            label: 'Top 10% Average',
            data: [{ x: 0, y: top10Average }, { x: Math.max(...data.map(point => point.x)), y: top10Average }],
            borderColor: 'green',
            borderWidth: 2,
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderDash: [5, 5]
        };
    
        const top25Line = {
            label: 'Top 25% Average',
            data: [{ x: 0, y: top25Average }, { x: Math.max(...data.map(point => point.x)), y: top25Average }],
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderDash: [5, 5],
            hidden: true
        };
    
        const top50Line = {
            label: 'Top 50% Average',
            data: [{ x: 0, y: top50Average }, { x: Math.max(...data.map(point => point.x)), y: top50Average }],
            borderColor: 'purple',
            borderWidth: 2,
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderDash: [5, 5]
        };
    
        const top75Line = {
            label: 'Top 75% Average',
            data: [{ x: 0, y: top75Average }, { x: Math.max(...data.map(point => point.x)), y: top75Average }],
            borderColor: 'orange',
            borderWidth: 2,
            fill: false,
            type: 'line',
            pointRadius: 0,
            borderDash: [5, 5],
            hidden: true
        };
    
        scatterChart.data.datasets = [{
            label: club,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }, averageLine, top10Line, top25Line, top50Line, top75Line];
    
        scatterChart.options.scales.x.title.text = xAxis.replace(/_/g, ' ');
        scatterChart.options.scales.y.title.text = yAxis.replace(/_/g, ' ');
        scatterChart.update();
    
        // Update the number of data points
        dataPointCount.textContent = `Number of Data Points: ${data.length}`;
    
        // Calculate and display values
        calculateValues(club, yAxis);
    }

    function getColumnIndex(columnName) {
        const columns = {
            'data_point': 1,
            'carry_distance_range': 4,
            'flat_carry_distance_range': 5,
            'total_distance_range': 6,
            'flat_total_distance_range': 7,
            'apex_range': 8,
            'ball_speed_range': 9,
            'launch_angle': 11
        };
        return columns[columnName];
    }

    function calculateValues(club, yAxis) {
        const values = [];
    
        rows.forEach(row => {
            if (row.getAttribute('data-club') === club) {
                values.push(parseFloat(row.querySelector(`td:nth-child(${getColumnIndex(yAxis)})`).innerText));
            }
        });
    
        if (values.length === 0) {
            document.getElementById('average-value').textContent = 'Average: N/A';
            document.getElementById('variance').textContent = 'Variance: N/A';
            document.getElementById('average-range').textContent = 'Range: N/A';
            document.getElementById('bottom-1').textContent = 'Bottom 1%: N/A';
            document.getElementById('top-1').textContent = 'Top 1%: N/A';
            document.getElementById('top-10-value').textContent = 'Top 10% Average: N/A';
            document.getElementById('top-25-value').textContent = 'Top 25% Average: N/A';
            document.getElementById('top-50-value').textContent = 'Top 50% Average: N/A';
            document.getElementById('top-75-value').textContent = 'Top 75% Average: N/A';
            return;
        }
    
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        values.sort((a, b) => b - a); // Sort in descending order
    
        const top10Values = values.slice(0, Math.ceil(values.length * 0.1));
        const top25Values = values.slice(0, Math.ceil(values.length * 0.25));
        const top50Values = values.slice(0, Math.ceil(values.length * 0.5));
        const top75Values = values.slice(0, Math.ceil(values.length * 0.75));
    
        const top10Average = top10Values.reduce((a, b) => a + b, 0) / top10Values.length;
        const top25Average = top25Values.reduce((a, b) => a + b, 0) / top25Values.length;
        const top50Average = top50Values.reduce((a, b) => a + b, 0) / top50Values.length;
        const top75Average = top75Values.reduce((a, b) => a + b, 0) / top75Values.length;
    
        // Calculate 95% and 105% of the average
        const rangeMin = average * 0.95;
        const rangeMax = average * 1.05;
    
        // Calculate P45 and P55 values
        const p45Index = Math.floor(values.length * 0.45);
        const p55Index = Math.floor(values.length * 0.55);
        const p45Value = values[p45Index];
        const p55Value = values[p55Index];
        const p45Variance = p45Value - average;
        const p55Variance = p55Value - average;
    
        document.getElementById('average-value').textContent = `Average: ${average.toFixed(2)}`;
        document.getElementById('variance').textContent = `Variance:  -${p45Variance.toFixed(2)}, +${p55Variance.toFixed(2)}`;
        document.getElementById('average-range').textContent = `Range: ${rangeMin.toFixed(2)} - ${rangeMax.toFixed(2)}`;
        document.getElementById('bottom-1').textContent = `Minimum: ${min.toFixed(2)}`;
        document.getElementById('top-1').textContent = `Maximum: ${max.toFixed(2)}`;
        document.getElementById('top-10-value').textContent = `Top 10% Average: ${top10Average.toFixed(2)}`;
        document.getElementById('top-25-value').textContent = `Top 25% Average: ${top25Average.toFixed(2)}`;
        document.getElementById('top-50-value').textContent = `Top 50% Average: ${top50Average.toFixed(2)}`;
        document.getElementById('top-75-value').textContent = `Top 75% Average: ${top75Average.toFixed(2)}`;
    }

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const club = this.getAttribute('data-club');
            updateChart(club);
            document.querySelectorAll('.club-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    xAxisSelect.addEventListener('change', function() {
        const selectedButton = document.querySelector('.club-button.active');
        if (selectedButton) {
            updateChart(selectedButton.getAttribute('data-club'));
        }
    });

    yAxisSelect.addEventListener('change', function() {
        const selectedButton = document.querySelector('.club-button.active');
        if (selectedButton) {
            updateChart(selectedButton.getAttribute('data-club'));
        }
    });
});