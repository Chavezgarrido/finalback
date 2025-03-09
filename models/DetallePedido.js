module.exports = (sequelize, DataTypes) => {
    const DetallePedido = sequelize.define('DetallePedido', {
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        precio_unitario: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    });

    return DetallePedido;
};