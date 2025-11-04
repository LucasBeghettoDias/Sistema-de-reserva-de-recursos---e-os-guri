const path = require('path')
const {Sequelize} = require('sequelize');

const dbPath = process.env.DB_PATH || path.join(__dirname,'..','database.sqlite');

const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage: dbPath,
        logging: false
    }
);

const Recurso = require('./recurso.js')(sequelize);
const Reserva = require('./reserva.js')(sequelize);

//Associações: um recurso tem muitas reservas

Recurso.hasmany(Reserva,{as: 'reservas',foreignKey: 'recursoId', onDelete: 'CASCADE'});
Reserva.belongsTo(Recurso,{as: 'recurso',foreignKey: 'recursoId'});

module.exports = {sequelize, Recurso, Reserva};