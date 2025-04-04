const { Router } = require('express');
const carController = require('../controllers/carController');
const { validateCarCreate, validateCarUpdate, validateCarItems } = require('../middlewares/validator');

const router = Router();

router.post('/cars', validateCarCreate, carController.createCar);
router.get('/cars', carController.listCars);
router.get('/cars/:id', carController.getCar);
router.patch('/cars/:id', validateCarUpdate, carController.updateCar);
router.put('/cars/:id/items', validateCarItems, carController.updateCarItems);
router.delete('/cars/:id', carController.deleteCar);

module.exports = router;