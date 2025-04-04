const { Op } = require('sequelize');
const { Car, CarItem, sequelize } = require('../models');

class CarRepository {

    /**
     * @param {Object} carData 
     * @returns {Promise<Car>}
     */
    async createCar(carData) {
        return await Car.create(carData);
    }

    /**
     * @param {number} id 
     * @returns {Promise<Car>}
     */
    async findCarById(id) {
        return await Car.findByPk(id, {
            include: [
                {
                    model: CarItem,
                    as: 'items',
                    attributes: ['id', 'name', 'created_at']
                }
            ]
        });
    }

    /**
     * @param {string} plate 
     * @returns {Promise<Car>}
     */
    async findCarByPlate(plate) {
        return await Car.findOne({
            where: { plate }
        });
    }

    /**
     * @param {Object} filters 
     * @param {Object} pagination 
     * @returns {Promise<Object>}
     */
    async findCars(filters, pagination) {
        const { year, final_plate, brand } = filters;
        const { page, limit } = pagination;

        const where = {};

        if (year) {
            where.year = {
                [Op.gte]: year
            };
        }

        if (final_plate) {

            const carsWithFinalPlate = [];

            for (const car of allCars) {
                if (this.hasPlateEndingWith(car.plate, final_plate)) {
                    carsWithFinalPlate.push(car);
                }
            }

            filteredCars = carsWithFinalPlate;

        }

        if (brand) {
            where.brand = {
                [Op.like]: `%${brand}%`
            };
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Car.findAndCountAll({
            where,
            limit,
            offset,
            order: [['id', 'ASC']]
        });

        return {
            count,
            pages: Math.ceil(count / limit),
            data: rows
        };
    }

    /**
     * @param {number} id 
     * @param {Object} carData 
     * @returns {Promise<number>}
     */
    async updateCar(id, carData) {
        return await Car.update(carData, {
            where: { id }
        });
    }

    /**
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    async deleteCar(id) {
        const transaction = await sequelize.transaction();

        try {
            await CarItem.destroy({
                where: { car_id: id },
                transaction
            });

            const result = await Car.destroy({
                where: { id },
                transaction
            });

            await transaction.commit();
            return result > 0;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * @param {number} carId 
     * @returns {Promise<number>}
     */
    async deleteCarItems(carId) {
        return await CarItem.destroy({
            where: { car_id: carId }
        });
    }

    /**
     * @param {Array} items 
     * @param {number} carId 
     * @returns {Promise<Array>}
     */
    async addCarItems(items, carId) {
        const itemsWithCarId = items.map(item => ({
            name: item.name,
            car_id: carId
        }));

        return await CarItem.bulkCreate(itemsWithCarId);
    }

    /**
     * @param {Array} items 
     * @param {number} carId 
     * @returns {Promise<Array>}
     */
    async updateCarItems(items, carId) {
        const transaction = await sequelize.transaction();

        try {
            await this.deleteCarItems(carId);

            const result = await this.addCarItems(items, carId);

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * @param {string} plate
     * @param {string} finalChar
     * @returns {boolean}
     */
    hasPlateEndingWith(plate, finalChar) {
        if (!plate || typeof plate !== 'string' || !finalChar || typeof finalChar !== 'string') {
            return false;
        }

        const lastChar = plate.charAt(plate.length - 1);
        return lastChar === finalChar;
    }

}

module.exports = new CarRepository();