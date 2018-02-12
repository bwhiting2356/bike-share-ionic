"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearestStation = function () {
    var request = {
        origins: ['321 Magnolia, Millbrae CA'],
        destinations: [{
                lat: 37.596557,
                lng: -122.395373
            }, {
                lat: 37.608525,
                lng: -122.409767
            }],
        mode: 'walking'
    };
    client.distanceMatrix(request, function (err, response) { return console.log(response.json.rows[0].elements); });
};
exports.findNearestStation();
