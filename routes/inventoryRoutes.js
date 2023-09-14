const express = require('express');
const middleware = require('../Middleware/authMiddleware');
const { createInventoryController, getInventoryController, getDonarsControllers, getHospitalController, getOrgnaisationController, getOrgnaisationForHospitalController, getInventoryHospitalController } = require('../controllers/inventoryController');

const router = express();

// create-inventory 
router.post('/create-inventory', middleware, createInventoryController)
// get all blood record
router.get('/get-inventory', middleware, getInventoryController)
// get donar record
router.get('/get-donars', middleware, getDonarsControllers)
// get hospital record
router.get('/get-hospitals', middleware, getHospitalController)
// get organisation
router.get('/get-orgnaisation', middleware, getOrgnaisationController)
// get-orgnaisation-for-hospital
router.get('/get-orgnaisation-for-hospital', middleware, getOrgnaisationForHospitalController)

//GET HOSPITAL BLOOD RECORDS
router.post(
    "/get-inventory-hospital",
    middleware,
    getInventoryHospitalController
);


module.exports = router