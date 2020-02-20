
simplePlot();
staticChart();
downloadSvg();
annotations3d();
basicTimeSeries();
uahTempTimeSeries();

/* Current Plotly.js version */
console.log( Plotly.BUILD );

/**
 * Basic simple plot
 */
function simplePlot() {
    TESTER = document.getElementById('simple-plot');

    Plotly.plot( TESTER, [{
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16] }], {
        margin: { t: 0 } }, {showSendToCloud:true} );
}

/**
 * Create a static chart instead of the default interactive one
 */
function staticChart() {
    var trace1 = {
        x: [0, 1, 2, 3, 4, 5, 6],
        y: [1, 9, 4, 7, 5, 2, 4],
        mode: 'markers',
        marker: {
            size: [20, 40, 25, 10, 60, 90, 30],
        }
    };

    var data = [trace1];

    var layout = {
        title: 'Create a Static Chart',
        showlegend: false
    };

    Plotly.newPlot('static-plot', data, layout, {staticPlot: true});
}

/**
 * Change default download image to SVG instead of PNG
 */
function downloadSvg() {
    var trace1 = {
        x: [0, 1, 2, 3, 4, 5, 6],
        y: [1, 9, 4, 7, 5, 2, 4],
        mode: 'markers',
        marker: {
            size: [20, 40, 25, 10, 60, 90, 30],
        }
    };

    var data = [trace1];

    var layout = {
        title: 'Download Chart as SVG instead of PNG',
        showlegend: false
    };

    var config = {
        toImageButtonOptions: {
            format: 'svg', // one of png, svg, jpeg, webp
            filename: 'custom_image',
            height: 500,
            width: 700,
            scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
    };

    Plotly.newPlot('download-svg', data, layout, config);
}

function annotations3d() {
    var data = [{
        type: "scatter3d",
        x: ["2017-01-01", "2017-02-10", "2017-03-20"],
        y: ["A", "B", "C"],
        z: [1, 1e3, 1e5]
    }]

    var layout = {
        scene: {
            camera: {
                eye: {x: 2.1, y: 0.1, z: 0.9}
            },
            xaxis: {
                title: ""
            },
            yaxis: {
                title: ""
            },
            zaxis: {
                type: "log",
                title: ""
            },
            annotations: [{
                showarrow: false,
                x: "2017-01-01",
                y: "A",
                z: 0,
                text: "Point 1",
                font: {
                    color: "black",
                    size: 12
                },
                xanchor: "left",
                xshift: 10,
                opacity: 0.7
            }, {
                x: "2017-02-10",
                y: "B",
                z: 4,
                text: "Point 2",
                textangle: 0,
                ax: 0,
                ay: -75,
                font: {
                    color: "black",
                    size: 12
                },
                arrowcolor: "black",
                arrowsize: 3,
                arrowwidth: 1,
                arrowhead: 1
            }, {
                x: "2017-03-20",
                y: "C",
                z: 5,
                ax: 50,
                ay: 0,
                text: "Point 3",
                arrowhead: 1,
                xanchor: "left",
                yanchor: "bottom"
            }]
        }
    }

    Plotly.newPlot('annotations-3d', data, layout);
}

function basicTimeSeries() {
    // Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", function(err, rows){
    Plotly.d3.csv("http://localhost:8888/data/finance-charts-apple.csv", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }


        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL High',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.High'),
            line: {color: '#17BECF'}
        }

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL Low',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.Low'),
            line: {color: '#7F7F7F'}
        }

        var data = [trace1,trace2];

        var layout = {
            title: 'Basic Time Series',
        };

        Plotly.newPlot('basic-time-series', data, layout);
    })
}

function uahTempTimeSeries() {
    Plotly.d3.csv("http://localhost:8888/data/uah-monthly.csv", function(err, rows){
    // Plotly.d3.dsv(" ", "http://localhost:8888/data/uah-monthly-date.txt", function(err, rows){
    // Plotly.d3.dsv("|", "http://localhost:8888/data/uah-monthly-date-delim.txt", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }


        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'Global Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Globe'),
            line: {color: '#17BECF'}
        }

        // var trace2 = {
        //     type: "scatter",
        //     mode: "lines",
        //     name: 'NH Avg Temp',
        //     x: unpack(rows, 'Date'),
        //     y: unpack(rows, 'NH'),
        //     line: {color: '#7F7F7F'}
        // }
        //
        // var data = [trace1,trace2];

        var data = [trace1];

        var layout = {
            title: 'UAH Temp Time Series',
        };

        Plotly.newPlot('uah-temp-time-series', data, layout);
    })
}

