//1. Importação dos pacotes
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//2. importações locais
const {sequelize}= require('./models');
const recursosRoute = require('./routes/recursosRoute');
const reservasRoute= require('./routes/reservasRoute');

//3. inicilaização do express
const app = express();
const PORT = process.env.PORT || 3001;

//4. configuração de MIDDLEWARE
app.use(cors());

//5. habilita o express para aceitar JSON nas requisições de body
app.use(express.json());

//6. definimos as rotas da api
app.use('/api/recursos',recursosRoute);
app.use('/api/reservas',reservasRoute);

app.get('/',(req,res)=>{
    res.send('API do Sistema de Reservas - OK');
});

sequelize.sync({
    //force:true  só descomente se quiser pagar o banco e recriá-lo
}).then(()=>{
    console.log('Banco de dados conectado e tabelas sincronizadas');

    app.listen(PORT, ()=>{
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

}).catch(err =>{
    console.error('Erro ao conectar ou sincronizar o banco de dados',err );
});

