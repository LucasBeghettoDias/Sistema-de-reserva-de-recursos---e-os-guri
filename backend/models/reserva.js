const {DataTypes} = Require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('Reserva',{
        recursoId: {type: DataTypes.INTEGER, allowNull: false},
        usuarioId: {type: DataTypes.STRING, allowNull: false},
        startAt: {type: DataTypes.DATE, allowNull: false},
        endAT: {type: DataTypes.DATE, allowNull: false},
        justificativa: {type: DataTypes.DATE, allowNull: false},
        purpose:{type: DataTypes.STRING, allowNull: true},
        status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'confirmed'}
    },{
        tableName: 'reservas',
        timestamps:true
    });
};

