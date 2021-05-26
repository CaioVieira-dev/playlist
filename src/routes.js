const express = require('express');
const routes = express.Router();
const DashboardController = require('./controllers/DashboardController')


routes.get('/', DashboardController.index)
routes.post('/', DashboardController.save)
routes.post('/update/:id', DashboardController.update)
routes.post('/delete/:id', DashboardController.delete)
module.exports = routes;