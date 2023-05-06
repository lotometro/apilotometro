var config = require('config.json');
var Q = require('q');
var lodash = require('lodash');
var connection = config.connectionString;
var database = config.database;
const ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));


var service = {};
service.create = create;
service.getById = getById;
service.getByIdLocationAndIdCamera = getByIdLocationAndIdCamera;
service.getLastByIdLocationAndIdCamera = getLastByIdLocationAndIdCamera;
service.listCamera = listCamera;
service.update = update;
service.delete = _delete;

module.exports = service;


function create(cameraParam) {
    var deferred = Q.defer();
    var camera = global.conn.collection("camera");

    camera.insertOne(
        cameraParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    var camera = global.conn.collection("camera");
    camera.findOne({ _id: new ObjectID.createFromHexString(_id) }, function (err, camera) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (camera) {
            // return user (without hashed password)
            deferred.resolve(camera);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getByIdLocationAndIdCamera(idLocal, idCamera) {
    var deferred = Q.defer();
    var cameras = global.conn.collection("camera");
    cameras.find({ idLocal: idLocal, idCamera: idCamera }).toArray(function (err, cameras) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (cameras) {
            // return user (without hashed password)
            deferred.resolve(cameras);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getLastByIdLocationAndIdCamera(idLocal, idCamera) {
    var deferred = Q.defer();
    var cameras = global.conn.collection("camera");
    cameras.find({ idLocal: idLocal, idCamera: idCamera })
           .sort({ dataInformacao: -1 })
           .limit(1).toArray(function (err, cameras) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (cameras) {
            // return user (without hashed password)
            deferred.resolve(cameras);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function listCamera() {
    var deferred = Q.defer();
    var people = global.conn.collection("camera");

    people.find().toArray(function (err, camera) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (camera) {
            // return user (without hashed password)
            deferred.resolve(camera);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function update(cameraParam) {
    var deferred = Q.defer();
    var camera = global.conn.collection("camera");
    
    // validation
    camera.findOne({ _id: new ObjectID.createFromHexString( cameraParam._id) }, function (err, camera) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (camera) {
            updateCamera();
        }
    });

    function updateCamera() {
        // fields to update
        var set = lodash.omit(cameraParam, '_id');

        camera.updateOne(
            { _id:new ObjectID.createFromHexString( cameraParam._id) },
            { $set: set },
            function (err, doc) {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    var camera = global.conn.collection("camera");
    camera.deleteOne(
        { _id: new ObjectID.createFromHexString(_id) },
        function (err) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            deferred.resolve();
        });

    return deferred.promise;
}

