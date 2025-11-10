//1. Importacao dos pacotes
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//2. importacoes locais

const {sequelize} = require('./models');
const recursosRoute = require('./routes/recursosRoute');
const reservasRoute = require('./routes/reservasRoute');

//3. inicializacao do express

const app = express();
const PORT = process.env.PORT || 3001;

//4. configuracao de middleware

app.use(cors());

//5. habilitar express para aceitar JSON nas requisicoes de body

app.use(express.json());

//6. definimos as rotas da API

app.use('api/recursos', recursosRoute);
app.use('api/reservas', reservasRoute);

app.get('/', (req, res)=>{
    res.send('API do sistema de reservas - OK');
});

sequelize.sync({
    //force: true   //so descomente se quiser resetar o banco
}).then(()=>{
    console.log('Banco de dados conectado e tabelas sincronizadas');

    app.listen(PORT, ()=>{
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });


}).catch(err =>{
    console.error('Erro ao conectar ou sincronizar o banco de dados', err);
});