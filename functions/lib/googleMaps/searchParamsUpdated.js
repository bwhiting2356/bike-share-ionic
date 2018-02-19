"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var serverMapGeoPointToLatLng_1 = require("./serverMapGeoPointToLatLng");
var findNearestStations_1 = require("./findNearestStations");
var getDirections_1 = require("./getDirections");
exports.searchParamsUpdated = functions.firestore
    .document('/users/{userId}')
    .onUpdate(function (event) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var userData, origin, destination, nearestOriginStationsPromise, nearestDestinationStationsPromise, walking1PointsPromise, bicyclingPointsPromise, walking2PointsPromise, stationStart, stationEnd;
    return __generator(this, function (_a) {
        userData = event.data.data();
        origin = userData.searchOrigin ? serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchOrigin) : null;
        destination = userData.searchDestination ? serverMapGeoPointToLatLng_1.serverMapGeoPointToLatLng(userData.searchDestination) : null;
        if (origin) {
            nearestOriginStationsPromise = findNearestStations_1.findNearestStations(origin);
            nearestOriginStationsPromise
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var walking1Query;
                return __generator(this, function (_a) {
                    stationStart = response.data[0].coords;
                    walking1Query = {
                        origin: origin,
                        destination: stationStart,
                        mode: 'walking'
                    };
                    walking1PointsPromise = getDirections_1.getDirections(walking1Query);
                    return [2 /*return*/];
                });
            }); })
                .catch(function (err) {
                console.log('line 43: ', err);
            });
        }
        // have the destination coords changed since the previous value?
        if (destination) {
            nearestDestinationStationsPromise = findNearestStations_1.findNearestStations(destination);
            nearestDestinationStationsPromise
                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                var walking2Query;
                return __generator(this, function (_a) {
                    stationEnd = response.data[0].coords;
                    walking2Query = {
                        origin: origin,
                        destination: stationEnd,
                        mode: 'walking'
                    };
                    walking2PointsPromise = getDirections_1.getDirections(walking2Query);
                    return [2 /*return*/];
                });
            }); })
                .catch(function (err) {
                console.log('line 69: ', err);
            });
        }
        // if neither was changed, exit this function
        if (origin && destination) {
            return [2 /*return*/, Promise.all([nearestOriginStationsPromise, nearestDestinationStationsPromise])
                    .then(function (results) { return __awaiter(_this, void 0, void 0, function () {
                    var bicyclingQuery;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                bicyclingQuery = {
                                    origin: results[0].data[0].coords,
                                    destination: results[1].data[0].coords,
                                    mode: 'bicycling'
                                };
                                return [4 /*yield*/, getDirections_1.getDirections(bicyclingQuery)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); }).then(function (bicyclingResults) {
                    return Promise.all([walking1PointsPromise, walking2PointsPromise])
                        .then(function (walkingResults) {
                        console.log('all items: ');
                        console.log('origin: ', origin);
                        console.log('walking1Points: ', walkingResults[0]);
                        console.log('stationStart: ', stationStart);
                        console.log('bicyclingPoints: ', bicyclingResults);
                        console.log('stationEnd: ', stationEnd);
                        console.log('walking2Points: ', walkingResults[1]);
                        console.log('destination: ', destination);
                    });
                })];
        }
        else {
            return [2 /*return*/, Promise.resolve()];
        }
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=searchParamsUpdated.js.map