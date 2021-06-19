'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // belongsToOne
      Order.belongsTo(models.Payment);
      // belongsToOne
      Order.belongsTo(models.State);
      
      // belongsTo
      Order.belongsTo(models.User);

      // hasMany
      Order.hasMany(models.OrderDetail, {
        foreignKey: 'orders_id',
        as: "orderdetails"
      })

      // hasOne
      Order.hasOne(models.Shipping, {
        as: 'shippings',
        foreignKey: 'orders_id'
      })
    }
  };
  Order.init({
    number: DataTypes.INTEGER,
    date: DataTypes.DATE,
    total: DataTypes.DECIMAL,
    payments_id: DataTypes.INTEGER,
    users_id: DataTypes.INTEGER,
    user_addresses_id: DataTypes.INTEGER,
    states_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};