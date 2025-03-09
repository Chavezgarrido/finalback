const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Carrito extends Model {}

  Carrito.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario', 
        key: 'id',
      },
    },
    productos: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Carrito',
    timestamps: true,
  });

  return Carrito;
};