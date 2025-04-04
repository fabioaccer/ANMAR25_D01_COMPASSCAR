const carRepository = require('../repositories/carRepository');
const ApiError = require('../utils/apiError');

class CarService {

    /**
     * @param {Object} carData 
     * @returns {Promise<Car>}
     */
    async createCar(carData) {

        const existingCar = await carRepository.findCarByPlate(carData.plate);

        if (existingCar) {
            throw ApiError.conflict('car already registered');
        }

        return await carRepository.createCar(carData);

    }

    /**
     * @param {number} id 
     * @returns {Promise<Car>}
     */
    async getCarById(id) {

        const car = await carRepository.findCarById(id);

        if (!car) {
            throw ApiError.notFound('car not found');
        }

        return car;
    }

    /**
     * @param {Object} filters 
     * @param {Object} pagination 
     * @returns {Promise<Object>}
     */
    async listCars(filters, pagination) {
        return await carRepository.findCars(filters, pagination);
    }

    /**
     * @param {number} id 
     * @param {Object} carData 
     * @returns {Promise<void>}
     */
    async updateCar(id, carData) {

        Object.keys(carData).forEach(key => {
            if (carData[key] === '' || carData[key] === null || carData[key] === undefined) {
                delete carData[key];
            }
        });

        if (Object.keys(carData).length === 0) {

            const car = await carRepository.findCarById(id);

            if (!car) {
                throw ApiError.notFound('car not found');
            }

            return;

        }

        if (carData.plate) {

            const existingCar = await carRepository.findCarByPlate(carData.plate);

            if (existingCar && existingCar.id !== parseInt(id)) {
                throw ApiError.conflict('car already registered');
            }

        }

        const [updatedRows] = await carRepository.updateCar(id, carData);

        if (updatedRows === 0) {
            throw ApiError.notFound('car not found');
        }
    }

    /**
     * @param {number} id 
     * @param {Array} items 
     * @returns {Promise<void>}
     */
    async updateCarItems(id, items) {

        const car = await carRepository.findCarById(id);

        if (!car) {
            throw ApiError.notFound('car not found');
        }

        await carRepository.updateCarItems(items, id);

    }

    /**
     * @param {number} id 
     * @returns {Promise<void>}
     */
    async deleteCar(id) {

        const car = await carRepository.findCarById(id);

        if (!car) {
            throw ApiError.notFound('car not found');
        }

        await carRepository.deleteCar(id);

    }
    
}

module.exports = new CarService();