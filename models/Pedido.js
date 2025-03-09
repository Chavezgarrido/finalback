const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Pedido extends Model {}

  Pedido.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario', 
        key: 'id',
      },
    },
    direccion_envio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detalles: {
      type: DataTypes.JSON, 
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'pendiente', 
    },
  }, {
    sequelize,
    modelName: 'Pedido',
    timestamps: true,
  });

  return Pedido;
};