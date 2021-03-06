const functions = require('firebase-functions');
const googleMapsClient = require('./googleMaps/googleMapsClient').googleMapsClient;
const memoize = require('./memoize').memoize;

exports.testAsyncHttp = functions.https.onRequest(function(request, response) {
  const origin = request.body.origin;
  const destination = request.body.destination;
  const mode = request.body.mode;

  var query = {
    origin: origin,
    destination: destination,
    mode: mode
  };

  function getDirections(query) {
    return new Promise(function(resolve) {
      googleMapsClient.directions(query, function(err, res) {
        var result = res.json.routes[0].legs[0].steps.map(function(step) {
          return step.start_location
        });
        result.push(query.destination);
        resolve(result);
      });
    });
  }

  return memoize(getDirections)(query)
    .then(function(result) {
      return response.send(result);
    })
});
