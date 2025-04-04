const sequelize = require('../config/database');
const Car = require('./Car');
const CarItem = require('./CarItem');

Car.hasMany(CarItem, {
  foreignKey: 'car_id',
  as: 'items'
});

CarItem.belongsTo(Car, {
  foreignKey: 'car_id',
  as: 'car'
});

module.exports = {
  sequelize,
  Car,
  CarItem
};