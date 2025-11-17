const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('Recurso',{
        nome: {type: DataTypes.STRING, allowNull: false},
        tipo: {type: DataTypes.STRING, allowNull: true},
        status:{type: DataTypes.STRING, allowNull: false, defaultValue: 'ativo'},
        capacity: {type: DataTypes.INTEGER, allowNull: true},
        location: {type: DataTypes.STRING, allowNull: true},
        meta: {type: DataTypes.JSON, allowNull: true}
    }, {
        tableName: 'recursos',
        timestamps: true
    });
};