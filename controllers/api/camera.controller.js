var express = require('express');
var router = express.Router();
var cameraService = require('services/camera.service');

// routes
router.post('/', createCamera);
router.get('/getAllCameraRegisters', listCamera);
router.put('/', updateCamera);
router.get('/:_id', getCurrentCamera);
router.get('/getByIdLocationAndIdCamera/:idLocation/:idCamera', getByIdLocationAndIdCamera);
router.get('/getLastByIdLocationAndIdCamera/:idLocation/:idCamera', getLastByIdLocationAndIdCamera);
router.delete('/:_id', deleteCamera);
    
module.exports = router;

function createCamera(req, res) {
    cameraService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function listCamera(req, res) {

        cameraService.listCamera()
            .then(function (camera) {
                if (camera) {
                    res.send(camera);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
}

function getCurrentCamera(req, res) {
    var cameraId = req.params._id;
    cameraService.getById(cameraId)
        .then(function (camera) {
            if (camera) {
                res.send(camera);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getByIdLocationAndIdCamera(req, res) {
    var idLocation = parseInt(req.params.idLocation);
    var idCamera = parseInt(req.params.idCamera);
    cameraService.getByIdLocationAndIdCamera(idLocation, idCamera)
        .then(function (cameras) {
            if (cameras) {
                res.send(cameras);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getLastByIdLocationAndIdCamera(req, res) {
    var idLocation = parseInt(req.params.idLocation);
    var idCamera = parseInt(req.params.idCamera);
    cameraService.getLastByIdLocationAndIdCamera(idLocation, idCamera)
        .then(function (cameras) {
            if (cameras) {
                res.send(cameras);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateCamera(req, res) {
    cameraService.update(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteCamera(req, res) {
    var cameraId = req.params._id;
    cameraService.delete(cameraId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}