const express = require('express');
const server = express();
const routes = require('./routes.js');
const path = require('path');

//template engine
server.set('view engine', 'ejs');

//mudar localização da pasta views
server.set('views', path.join(__dirname, 'views'));

//habilitar arquivos estaticos //tudo que tiver na pasta public
server.use(express.static("public"));

//habilitar o req.body
server.use(express.urlencoded({ extended: true }));
//rotas
server.use(routes);
server.listen(3000, () => console.log('Servidor ligado na porta 3000'))