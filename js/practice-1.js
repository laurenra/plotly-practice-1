
var serverRoot = 'http://localhost:8888';
// var serverRoot = 'http://yburbs.com/plotly-practice-1';

simplePlot();
staticChart();
downloadSvg();
annotations3d();
basicTimeSeries();
uahTempTimeSeries();
noaaBatteryParkTimeSeries();

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
    // Plotly.d3.csv("http://localhost:8888/data/finance-charts-apple.csv", function(err, rows){
    Plotly.d3.csv(serverRoot + "/data/finance-charts-apple.csv", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        };


        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL High',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.High'),
            line: {color: '#17BECF'}
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL Low',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'AAPL.Low'),
            line: {color: '#7F7F7F'}
        };

        var data = [trace1,trace2];

        var layout = {
            title: 'Basic Time Series',
        };

        Plotly.newPlot('basic-time-series', data, layout);
    })
}

function uahTempTimeSeries() {
    // Plotly.d3.csv("http://localhost:8888/data/uah-monthly.csv", function(err, rows){
    Plotly.d3.csv(serverRoot + "/data/uah-monthly.csv", function(err, rows){
    // Plotly.d3.dsv(" ", "http://localhost:8888/data/uah-monthly-date.txt", function(err, rows){
    // Plotly.d3.dsv("|", "http://localhost:8888/data/uah-monthly-date-delim.txt", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var config = {
            toImageButtonOptions: {
                format: 'svg', // one of png, svg, jpeg, webp
                filename: 'custom_image',
                height: 500,
                width: 1300,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
        };

        var traceGlobe = {
            type: "scatter",
            mode: "lines",
            name: 'Global Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Globe'),
            line: {color: '#008000'}
            // line: {color: '[rgb(171,0,16)]'}
        };

        // var traceGlobe = {
        //     type: "scatter",
        //     mode: "lines",
        //     name: 'Global Avg Temp',
        //     x: unpack(rows, 'Date'),
        //     y: unpack(rows, 'Globe'),
        //
        //     // line: {color: '#008000'}
        //     // line: {color: '[[0, rgb(0,52,224)], [1, rgb(171,0,16)]]'}
        //     line: {color: '[[0, rgb(171,0,16)], [1, rgb(0,52,224)]]'}
        // };

        // var traceGlobe = {
        //     type: "scatter",
        //     mode: "lines",
        //     fill: 'tozeroy',
        //     name: 'Global Avg Temp',
        //     x: unpack(rows, 'Date'),
        //     y: unpack(rows, 'Globe'),
        //
        //     // line: {color: '#008000'}
        //     line: {color: '[[0, rgb(0,52,224)], [1, rgb(171,0,16)]]'}
        //     // line: {color: '[[0, rgb(171,0,16)], [1, rgb(0,52,224)]]'}
        // };

        // var traceNLand = {
        //     type: "scatter",
        //     mode: "lines",
        //     // fill: 'tonexty',
        //     fill: 'tozeroy',
        //     name: 'NH Land Avg Temp',
        //     x: unpack(rows, 'Date'),
        //     y: unpack(rows, 'NLand'),
        //     line: {color: '#aa7100'}
        // };

        var traceGlobeLand = {
            type: "scatter",
            mode: "lines",
            name: 'Global Land Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'GLand'),
            line: {color: '#af6700'}
        };

        var traceGlobeOcean = {
            type: "scatter",
            mode: "lines",
            name: 'Global Ocean Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'GOcean'),
            visible: 'legendonly',
            line: {color: '#0083e0'}
        };

        var traceNH = {
            type: "scatter",
            mode: "lines",
            name: 'Northern Hemisphere Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NH'),
            // showlegend: false,
            // visible: false,
            visible: 'legendonly',
            line: {color: '#36cb00'}
        };

        var traceNLand = {
            type: "scatter",
            mode: "lines",
            name: 'NH Land Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NLand'),
            visible: 'legendonly',
            line: {color: '#aa7100'}
        };

        var traceNOcean = {
            type: "scatter",
            mode: "lines",
            name: 'NH Ocean Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NOcean'),
            visible: 'legendonly',
            line: {color: '#00a6aa'}
        };

        var traceSH = {
            type: "scatter",
            mode: "lines",
            name: 'Southern Hemisphere Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SH'),
            visible: 'legendonly',
            line: {color: '#3bee00'}
        };

        var traceSLand = {
            type: "scatter",
            mode: "lines",
            name: 'SH Land Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SLand'),
            visible: 'legendonly',
            line: {color: '#cb8c00'}
        };

        var traceSOcean = {
            type: "scatter",
            mode: "lines",
            name: 'SH Ocean Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SOcean'),
            visible: 'legendonly',
            line: {color: '#00d0d0'}
        };

        var traceTrpcs = {
            type: "scatter",
            mode: "lines",
            name: 'Tropics Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Trpcs'),
            visible: 'legendonly',
            line: {color: '#d90000'}
            // line: {color: 'salmon'}
        };

        var traceNoExt = {
            type: "scatter",
            mode: "lines",
            name: 'Northern Extremes Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NoExt'),
            visible: 'legendonly',
            line: {color: '#c200d9'}
            // line: {color: 'salmon'}
        };

        var traceSoExt = {
            type: "scatter",
            mode: "lines",
            name: 'Southern Extremes Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SoExt'),
            visible: 'legendonly',
            line: {color: '#d99d00'}
            // line: {color: 'salmon'}
        };

        var traceNoPol = {
            type: "scatter",
            mode: "lines",
            name: 'North Polar Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NoPol'),
            visible: 'legendonly',
            line: {color: '#0087d9'}
            // line: {color: 'salmon'}
        };

        var traceSoPol = {
            type: "scatter",
            mode: "lines",
            name: 'South Polar Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SoPol'),
            visible: 'legendonly',
            line: {color: '#00e0eb'}
            // line: {color: 'salmon'}
        };

        var traceUSA48 = {
            type: "scatter",
            mode: "lines",
            name: 'USA Lower 48 Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'USA48'),
            visible: 'legendonly',
            line: {color: '#0008eb'}
            // line: {color: 'salmon'}
        };

        var traceUSA49 = {
            type: "scatter",
            mode: "lines",
            name: 'USA 49 States Avg Temp',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'USA49'),
            visible: 'legendonly',
            line: {color: '#eb6600'}
            // line: {color: 'salmon'}
        };

        // var data = [traceGlobe,traceNLand];
        // var data = [traceGlobe,traceNH,traceSH,traceTrpcs];
        var data = [traceGlobe,traceNH,traceSH,traceTrpcs,traceNoExt,traceSoExt,traceNoPol,traceSoPol,traceUSA48,traceUSA49];
        // var data = [traceGlobe,traceGlobeLand,traceGlobeOcean,traceNH,traceNLand,traceNOcean,traceSH,traceSLand,traceSOcean];

        // var data = [trace1];

        var layout = {
            title: 'UAH Temp Time Series'
        };

        Plotly.newPlot('uah-temp-time-series', data, layout, config);
    })
}

function noaaBatteryParkTimeSeries() {
    // Plotly.d3.csv("https://tidesandcurrents.noaa.gov/sltrends/data/8518750_meantrend.csv", function(err, rows){
    // Plotly.d3.csv("http://localhost:8888/data/noaa_battery_park_ny_meantrend.csv", function(err, rows){
    // Plotly.d3.csv("http://localhost:8888/data/noaa_battery_park_ny_meantrend-dates.csv", function(err, rows){
    Plotly.d3.csv(serverRoot + "/data/noaa_battery_park_ny_meantrend-dates.csv", function(err, rows){
    // Plotly.d3.dsv(" ", "http://localhost:8888/data/uah-monthly-date.txt", function(err, rows){
    // Plotly.d3.dsv("|", "http://localhost:8888/data/uah-monthly-date-delim.txt", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        };

        var config = {
            toImageButtonOptions: {
                format: 'svg', // one of png, svg, jpeg, webp
                filename: 'custom_image',
                height: 500,
                width: 1300,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
        };

        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'Monthly sea level MSL',
            x: unpack(rows, 'Year'),
            y: unpack(rows, 'Monthly_MSL'),
            line: {color: '#17BECF'}
        };

        var trace2 = {
            type: "scatter",
            mode: "lines",
            name: 'Linear Trend',
            x: unpack(rows, 'Year'),
            y: unpack(rows, 'Linear_Trend'),
            line: {color: '#7F7F7F'}
        };

        var data = [trace1,trace2];

        // var data = [trace1];

        var layout = {
            title: 'Battery Park, NY Tide Gauge'
        };

        Plotly.newPlot('noaa-battery-park-time-series', data, layout, config);
    })
}

