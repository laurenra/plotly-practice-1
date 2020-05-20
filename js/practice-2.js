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
// var serverRoot = 'http://yburbs.com/plotly-practice-2';

var serverPath = location.pathname; // "/plotly-practice-2/practice-2.html"
var pathOnly = serverPath.substr(0, location.pathname.lastIndexOf("/"));
var serverRoot = location.protocol + "//" + location.host + pathOnly;

/**
 * Create a URL query generator ("Copy Link" button) for the graph.
 */

europeBubbleMap();
usCityPopulations2014();

/* Current Plotly.js version */
console.log( Plotly.BUILD );

function europeBubbleMap() {
    var data = [{
        type: 'scattergeo',
        mode: 'markers',
        locations: ['FRA', 'DEU', 'RUS', 'ESP'],
        marker: {
            size: [20, 30, 15, 10],
            color: [10, 20, 40, 50],
            cmin: 0,
            cmax: 50,
            colorscale: 'Greens',
            colorbar: {
                title: 'Some rate',
                ticksuffix: '%',
                showticksuffix: 'last'
            },
            line: {
                color: 'black'
            }
        },
        name: 'europe data'
    }];

    var layout = {
        'geo': {
            'scope': 'europe',
            'resolution': 50
        }
    };

    Plotly.newPlot('europe-bubble-map', data, layout);
}


function usCityPopulations2014() {
    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2014_us_cities.csv', function(err, rows){

        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var cityName = unpack(rows, 'name'),
            cityPop = unpack(rows, 'pop'),
            cityLat = unpack(rows, 'lat'),
            cityLon = unpack(rows, 'lon'),
            color = [,"rgb(255,65,54)","rgb(133,20,75)","rgb(255,133,27)","lightgrey"],
            citySize = [],
            hoverText = [],
            scale = 50000;

        for ( var i = 0 ; i < cityPop.length; i++) {
            var currentSize = cityPop[i] / scale;
            var currentText = cityName[i] + " pop: " + cityPop[i];
            citySize.push(currentSize);
            hoverText.push(currentText);
        }

        var data = [{
            type: 'scattergeo',
            locationmode: 'USA-states',
            lat: cityLat,
            lon: cityLon,
            hoverinfo: 'text',
            text: hoverText,
            marker: {
                size: citySize,
                line: {
                    color: 'black',
                    width: 2
                },
            }
        }];

        var layout = {
            title: '2014 US City Populations',
            showlegend: false,
            geo: {
                scope: 'usa',
                projection: {
                    type: 'albers usa'
                },
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                subunitwidth: 1,
                countrywidth: 1,
                subunitcolor: 'rgb(255,255,255)',
                countrycolor: 'rgb(255,255,255)'
            },
        };

        Plotly.newPlot("us-city-pop-2014", data, layout, {showLink: false});

    });
}


