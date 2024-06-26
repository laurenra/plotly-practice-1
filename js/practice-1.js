/**
 * TODO: make a "Share Link" button that queries the DOM <g class="traces">
 *     under <g class="groups"> under <g class="legend"> under the
 *     <div id="uah-temp-time-series"> to get which ones are selected
 *     (style="opacity: 1" instead of style="opacity: 0.5) and builds a URL
 *     with query parameters.
 * TODO: figure out how to create plots, legends, and matching URL query parameters
 *     automatically from data headers.
 * TODO: figure out how to use command line R to get UAH data, convert to a
 *     time series (TS) to run statistical operations on it like decomposition,
 *     linear trends, etc., then populate columns with smoothing, linear trends, etc.
 */

// var serverRoot = 'http://localhost:8888';
// var serverRoot = 'http://yburbs.com/plotly-practice-1';

var serverPath = location.pathname; // "/plotly-practice-1/practice1.html"
var pathOnly = serverPath.substr(0, location.pathname.lastIndexOf("/"));
var serverRoot = location.protocol + "//" + location.host + pathOnly;

/**
 * Create a URL query generator ("Copy Link" button) for the graph.
 */

getUrlParamsTest();
annotations3d();
noaaBatteryParkTimeSeries();
uahTempTimeSeries();

// simplePlot();
// staticChart();
// downloadSvg();
// basicTimeSeries();

/* Current Plotly.js version */
console.log( Plotly.BUILD );

function getUrlParamsTest() {
    var urlFull = window.location.href; // get entire URL
    var queryIdx = urlFull.indexOf('?');
    var urlQuery = urlFull.split('?'); // original string of no ? for query
    var urlParms = urlFull.split('&');

    var urlSrch = window.location.search; // get query string only, including initial ?

    var urlSearchParams = new URLSearchParams(window.location.search);

    var entries = urlSearchParams.entries();
    for (keyval of entries) {
        console.log(keyval[0], keyval[1]);
    }
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

/**
 * Check query parameters to see if plot line is displayed.
 *
 * urlParm = URL query string (gAll, nhAll, tOcean, etc.)
 *
 * defaultDisplay = true:   null, &parm, &parm=1  return true   (show plot line)
 *                          &parm=0               returns false (don't show plot line)
 *
 * defaultDisplay = false:  &parm, &parm=1        return true   (show plot line)
 *                          null, &parm=0         return false  (don't show plot line)
 */
function displayPlotLine( urlParm = '', defaultDisplay = true) {
    var displayLine;

    /* Get URL query parameters to figure out what plots to show. */
    var urlQuery = new URLSearchParams(window.location.search);

    if (defaultDisplay == true) {
        // displayLine = urlQuery.get(urlParm) ? (urlQuery.get(urlParm) == 0) ? 'hide' : 'show' : 'show';
        displayLine = urlQuery.get(urlParm) ? (urlQuery.get(urlParm) == 0) ? false : true : true;
    }
    else {
        // displayLine = urlQuery.get(urlParm) == 1 ? 'show' : (urlQuery.get(urlParm) == '') ? 'show' : 'hide';
        displayLine = urlQuery.get(urlParm) == 1 ? true : (urlQuery.get(urlParm) == '') ? true : false;
    }

    // var urlgAllT = urlQuery.get('gAll') ? 'true' : 'false';           // &gAll=1 true,  &gAll=0 true,  &gAll FALSE, (na) FALSE
    // var urlgAllT = (urlQuery.get('gAll') == null) ? 'true' : 'false'; // &gAll=1 FALSE, &gAll=0 FALSE, &gAll FALSE, (na) true
    // var urlgAllT = (urlQuery.get('gAll') == '') ? 'true' : 'false';   // &gAll=1 FALSE, &gAll=0 FALSE, &gAll true,  (na) FALSE
    // var urlgAllT = (urlQuery.get('gAll') == 0) ? 'true' : 'false';    // &gAll=1 FALSE, &gAll=0 true,  &gAll true,  (na) FALSE
    // var urlgAllT = (urlQuery.get('gAll') == 1) ? 'true' : 'false';    // &gAll=1 true,  &gAll=0 FALSE, &gAll FALSE, (na) FALSE

    return displayLine;
}

/**
 * url query parameters show/hide plot lines
 *
 * Example: http://localhost:8000/practice-1.html?ga=0&ta&na
 * Turn off Global All, display Tropics All and Northern hemisphere All
 *
 * ga, gl, go = global All, Land, Oceans
 * na, nl, no = northern hemisphere All, Land, Oceans
 * sa, sl, so = southern hemisphere All, Land, Oceans
 * ta, tl, to = tropics All, Land, Oceans
 * nxa, nxl, nxo = northern extratropical All, Land, Oceans
 * sxa, sxl, sxo = southern extratropical All, Land, Oceans
 * npa, npl, npo = northern polar All, Land, Oceans
 * spa, spl, spo = southern polar All, Land, Oceans
 * us48, us49, aus = US lower 48, US 48 + Alaska, Australia?
 *
 * UAH Global Satellite Temperature
 *  GL 90S-90N, NH 0-90N, SH 90S-0,
 *  TRPCS 20S-20N, NoExt 20N-90N, SoExt 90S-20S,
 *  NoPol 60N-90N, SoPol 90S-60S
 *
 *  NoExt = Northern Extratropical
 *  SoExt = Southern Extratropical
 *  NoPol = Northern Polar
 *  SoPol = Southern Polar
 *  USA48 = USA lower-48
 *  USA49 = USA lower-48 + Alaska
 *
 */
function uahTempTimeSeries() {

    /**
     * Global temp
     * no param: visible = true
     * ga:       visible = true
     * ga=0:     visible = 'legendonly'
     * ga=1:     visible = true
     *
     * Tropics (and all others)
     * no param: visible = 'legendonly'
     * ta:       visible = true
     * ta=0:     visible = 'legendonly'
     * ta=1:     visible = true
     *
     * Query param example
     */

    // var gAllDisplay = displayPlotLine('gAll', true);
    // var tAllDisplay = displayPlotLine('tAll', false);

    /* Get data and build plot(s). */
    // Plotly.d3.csv("http://localhost:8888/data/uah-monthly.csv", function(err, rows){
    // Plotly.d3.csv(serverRoot + "/data/uahncdc_lt_6.0_monthly.csv", function(err, rows){
    Plotly.d3.csv(serverRoot + "/data/uah-monthly-all.csv", function(err, rows){
    // Plotly.d3.dsv(" ", "http://localhost:8888/data/uah-monthly-date.txt", function(err, rows){
    // Plotly.d3.dsv("|", "http://localhost:8888/data/uah-monthly-date-delim.txt", function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var yearsArray = unpack(rows, 'Date');
        var yaLen = yearsArray.length;
        var yaFirst = yearsArray[0];
        var yaLast = yearsArray[yaLen - 1];
        var dateFirst = new Date(yaFirst);
        var dateLast = new Date(yaLast);
        // console("First date:" + dateFirst.)


        var traceGlobal = {
            type: "scatter",
            mode: "lines",
            name: 'Global Average',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Global'),
            visible: displayPlotLine('ga', true) ? true : 'legendonly',
            // visible: urlParms.get('gAll') ?
            // line: {color: '#008000'}
            line: {color: '#555555'}
            // line: {color: '[rgb(171,0,16)]'}
        };


        // var traceGlobal = {
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

        var traceGLand = {
            type: "scatter",
            mode: "lines",
            name: 'Global Land Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'GLand'),
            visible: displayPlotLine('gl', false) ? true : 'legendonly',
            line: {color: '#af6700'}
        };

        var traceGOcean = {
            type: "scatter",
            mode: "lines",
            name: 'Global Ocean Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'GOcean'),
            visible: displayPlotLine('go', false) ? true : 'legendonly',
            line: {color: '#0083e0'}
        };

        var traceNH = {
            type: "scatter",
            mode: "lines",
            name: 'Northern Hemisphere',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NH'),
            // showlegend: false,
            // visible: false,
            visible: displayPlotLine('na', false) ? true : 'legendonly',
            line: {color: '#36cb00'}
        };

        var traceNLand = {
            type: "scatter",
            mode: "lines",
            name: 'NH Land Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NLand'),
            visible: displayPlotLine('nl', false) ? true : 'legendonly',
            line: {color: '#aa7100'}
        };

        var traceNOcean = {
            type: "scatter",
            mode: "lines",
            name: 'NH Ocean Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NOcean'),
            visible: displayPlotLine('no', false) ? true : 'legendonly',
            line: {color: '#00a6aa'}
        };

        var traceSH = {
            type: "scatter",
            mode: "lines",
            name: 'Southern Hemisphere',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SH'),
            visible: displayPlotLine('sa', false) ? true : 'legendonly',
            line: {color: '#3bee00'}
        };

        var traceSLand = {
            type: "scatter",
            mode: "lines",
            name: 'SH Land Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SLand'),
            visible: displayPlotLine('sl', false) ? true : 'legendonly',
            line: {color: '#cb8c00'}
        };

        var traceSOcean = {
            type: "scatter",
            mode: "lines",
            name: 'SH Ocean Only',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SOcean'),
            visible: displayPlotLine('so', false) ? true : 'legendonly',
            line: {color: '#00d0d0'}
        };

        var traceTropics = {
            type: "scatter",
            mode: "lines",
            name: 'Tropics (20°S–20°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'Tropics'),
            visible: displayPlotLine('ta', false) ? true : 'legendonly',
            line: {color: '#d90000'}
            // line: {color: 'salmon'}
        };

        var traceTLand = {
            type: "scatter",
            mode: "lines",
            name: 'Tropics Land Only (20°S–20°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'TLand'),
            visible: displayPlotLine('tl', false) ? true : 'legendonly',
            line: {color: '#d90000'}
            // line: {color: 'salmon'}
        };

        var traceTOcean = {
            type: "scatter",
            mode: "lines",
            name: 'Tropics Ocean Only (20°S–20°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'TOcean'),
            visible: displayPlotLine('to', false) ? true : 'legendonly',
            line: {color: '#d90000'}
            // line: {color: 'salmon'}
        };

        var traceNExtTropic = {
            type: "scatter",
            mode: "lines",
            name: 'NH Extratropical (20°N–90°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NExtTrpc'),
            visible: displayPlotLine('nxa', false) ? true : 'legendonly',
            line: {color: '#c200d9'}
            // line: {color: 'salmon'}
        };

        var traceNxLand = {
            type: "scatter",
            mode: "lines",
            name: 'NH Extratropical Land (20°N–90°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NxLand'),
            visible: displayPlotLine('nxl', false) ? true : 'legendonly',
            line: {color: '#c200d9'}
            // line: {color: 'salmon'}
        };

        var traceNxOcean = {
            type: "scatter",
            mode: "lines",
            name: 'NH Extratropical Ocean (20°N–90°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NxOcean'),
            visible: displayPlotLine('nxo', false) ? true : 'legendonly',
            line: {color: '#c200d9'}
            // line: {color: 'salmon'}
        };

        var traceSExtTropic = {
            type: "scatter",
            mode: "lines",
            name: 'SH Extratropical (90°S–20°S)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SExtTrpc'),
            visible: displayPlotLine('sxa', false) ? true : 'legendonly',
            line: {color: '#d99d00'}
            // line: {color: 'salmon'}
        };

        var traceSxLand = {
            type: "scatter",
            mode: "lines",
            name: 'SH Extratropical Land (90°S–20°S)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SxLand'),
            visible: displayPlotLine('sxl', false) ? true : 'legendonly',
            line: {color: '#d99d00'}
            // line: {color: 'salmon'}
        };

        var traceSxOcean = {
            type: "scatter",
            mode: "lines",
            name: 'SH Extratropical Ocean (90°S–20°S)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SxOcean'),
            visible: displayPlotLine('sxo', false) ? true : 'legendonly',
            line: {color: '#d99d00'}
            // line: {color: 'salmon'}
        };

        var traceNoPolar = {
            type: "scatter",
            mode: "lines",
            name: 'Northern Polar (60°N–90°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NoPolar'),
            visible: displayPlotLine('npa', false) ? true : 'legendonly',
            line: {color: '#0087d9'}
            // line: {color: 'salmon'}
        };

        var traceNpLand = {
            type: "scatter",
            mode: "lines",
            name: 'Northern Polar Land (60°N–90°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NpLand'),
            visible: displayPlotLine('npl', false) ? true : 'legendonly',
            line: {color: '#0087d9'}
            // line: {color: 'salmon'}
        };

        var traceNpOcean = {
            type: "scatter",
            mode: "lines",
            name: 'Northern Polar Ocean (60°N–90°N)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'NpOcean'),
            visible: displayPlotLine('npo', false) ? true : 'legendonly',
            line: {color: '#0087d9'}
            // line: {color: 'salmon'}
        };

        var traceSoPolar = {
            type: "scatter",
            mode: "lines",
            name: 'Southern Polar (90°S–60°S)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SoPolar'),
            visible: displayPlotLine('spa', false) ? true : 'legendonly',
            line: {color: '#00e0eb'}
            // line: {color: 'salmon'}
        };

        var traceSpLand = {
            type: "scatter",
            mode: "lines",
            name: 'Southern Polar Land (90°S–60°S)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SpLand'),
            visible: displayPlotLine('spl', false) ? true : 'legendonly',
            line: {color: '#00e0eb'}
            // line: {color: 'salmon'}
        };

        var traceSpOcean = {
            type: "scatter",
            mode: "lines",
            name: 'Southern Polar Ocean (90°S–60°S)',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'SpOcean'),
            visible: displayPlotLine('spo', false) ? true : 'legendonly',
            line: {color: '#00e0eb'}
            // line: {color: 'salmon'}
        };

        var traceUSA48 = {
            type: "scatter",
            mode: "lines",
            name: 'USA Lower 48',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'USA48'),
            visible: displayPlotLine('us48', false) ? true : 'legendonly',
            line: {color: '#0008eb'}
            // line: {color: 'salmon'}
        };

        var traceUSA49 = {
            type: "scatter",
            mode: "lines",
            name: 'USA Lower 48 + Alaska',
            x: unpack(rows, 'Date'),
            y: unpack(rows, 'USA49'),
            visible: displayPlotLine('us49', false) ? true : 'legendonly',
            line: {color: '#eb6600'}
            // line: {color: 'salmon'}
        };

        // var data = [traceGlobal,traceNLand];
        // var data = [traceGlobal,traceNH,traceSH,traceTropics];
        // var data = [traceGlobal,traceNH,traceSH,traceTrpcs,traceNExtTropic,traceSExtTropic,traceNoPol,traceSoPol,traceUSA48,traceUSA49];
        // var data = [traceGlobal,traceGLand,traceGOcean,traceNH,traceNLand,traceNOcean,traceSH,traceSLand,traceSOcean];
        var data = [traceGlobal,traceGLand,traceGOcean,
            traceNH,traceNLand,traceNOcean,
            traceSH,traceSLand,traceSOcean,
            traceTropics,traceTLand,traceTOcean,
            traceNExtTropic,traceNxLand,traceNxOcean,
            traceSExtTropic,traceSxLand,traceSxOcean,
            traceNoPolar,traceNpLand,traceNpOcean,
            traceSoPolar,traceSpLand,traceSpOcean,
            traceUSA48,traceUSA49];

        // var data = [trace1];

        var config = {
            toImageButtonOptions: {
                format: 'svg', // one of png, svg, jpeg, webp
                filename: 'custom_image',
                height: 500,
                width: 1300,
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
            }
        };

        var layout = {
            title: 'UAH Temperature Time Series',
            annotations: [{
                text: '(December, 1978&#8211;present)',
                font: {
                    size: 13
                    // color: '#eb6600'
                },
                showarrow: false,
                align: 'center',
                x: 0.6,
                y: 1.15,
                xref: 'paper',
                yref: 'paper'
            }],
            xaxis: {
                // title: 'Year (December 1978&ndash;present)'
                title: 'Date'
                // title: 'Year (December 1978&#x2013;present)'
            },
            yaxis: {
                title: 'Temperature &deg;C'
            }
        };

        Plotly.newPlot('uah-temp-time-series', data, layout, config);

        // var addData = [traceGLand, traceGOcean];
        // Plotly.addTraces('uah-temp-time-series', addData);
    })
}

/**
 * NOAA Battery Park, NY Sea Level Rise
 */
function noaaBatteryParkTimeSeries() {
    // Plotly.d3.csv("https://tidesandcurrents.noaa.gov/sltrends/data/8518750_meantrend.csv", function(err, rows){
    // Plotly.d3.csv("http://localhost:8888/data/noaa_battery_park_ny_meantrend.csv", function(err, rows){
    // Plotly.d3.csv("http://localhost:8888/data/noaa_battery_park_ny_meantrend-dates.csv", function(err, rows){
    // Plotly.d3.csv(serverRoot + "/data/noaa_battery_park_ny_meantrend-dates-old.csv", function(err, rows){
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

/**
 * Basic time series from sample finance chart
 */
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



