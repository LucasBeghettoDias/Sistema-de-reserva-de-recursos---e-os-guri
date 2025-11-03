const { path } = require('express/lib/application');
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    {
        dialect: 'sqlite',
        storage: process.env.DB_PATH || path.join(__dirname,' -- ',' -- ','database.sqlite'),
        logging: false
    }
);

const Recurso = require('./recurso.js');
const Reserva = require('./reserva.js');

//Associações: um recurso tem muitas reservas

Recurso.hasmany(Reserva,{as: 'reservas',ForeignKey: 'recursoId', onDelete: 'CASCADE'});
Reserva.belongsTo(Recurso,{as: 'recurso',ForeignKey: 'recursoId'});

module.exports = {sequelize, Recurso, Reserva};