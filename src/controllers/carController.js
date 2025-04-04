const carService = require('../services/carService');

class CarController {

    /**
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async createCar(req, res, next) {
        try {
            const { brand, model, plate, year } = req.body;

            const car = await carService.createCar({
                brand,
                model,
                plate: plate.toUpperCase(),
                year: parseInt(year)
            });

            return res.status(201).json(car);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async getCar(req, res, next) {
        try {
            const { id } = req.params;
            const car = await carService.getCarById(id);

            return res.status(200).json(car);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async listCars(req, res, next) {
        try {
            const { year, final_plate, brand } = req.query;

            let { page = 1, limit = 5 } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            if (isNaN(page) || page < 1) {
                page = 1;
            }

            if (isNaN(limit) || limit < 1) {
                limit = 5;
            } else if (limit > 10) {
                limit = 10;
            }

            const filters = {
                year: year ? parseInt(year) : null,
                final_plate,
                brand
            };

            const cars = await carService.listCars(filters, { page, limit });

            return res.status(200).json(cars);
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async updateCar(req, res, next) {
        try {
            const { id } = req.params;
            const { brand, model, plate, year } = req.body;

            const carData = {};

            if (brand !== undefined && brand !== null && brand !== '') {
                carData.brand = brand;
            }

            if (model !== undefined && model !== null && model !== '') {
                carData.model = model;
            }

            if (plate !== undefined && plate !== null && plate !== '') {
                carData.plate = plate.toUpperCase();
            }

            if (year !== undefined && year !== null && year !== '') {
                carData.year = parseInt(year);
            }

            await carService.updateCar(id, carData);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async updateCarItems(req, res, next) {
        try {
            const { id } = req.params;
            const { items } = req.body;

            await carService.updateCarItems(id, items);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    async deleteCar(req, res, next) {
        try {
            const { id } = req.params;

            await carService.deleteCar(id);

            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CarController();