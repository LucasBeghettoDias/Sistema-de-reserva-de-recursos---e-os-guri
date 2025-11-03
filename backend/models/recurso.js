const {DataTypes} = require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('Recurso',{
        name: {type: DataTypes.STRING, allowNull: false},
        type: {type: DataTypes.STRING, allowNull: true},
        capacity: {type: DataTypes.INTEGER, allowNull: true},
        location: {type: DataTypes.STRING, allowNull: true},
        meta: {type: DataTypes.JSON, allowNull: true}
    }, {
        tableName: 'recursos',
        timestamps: true
    });
};