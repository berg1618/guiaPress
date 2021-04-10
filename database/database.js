const Sequelize = require('sequelize');

const connection = new Sequelize('guiapress', 'root', 'senhachata',{
	host: 'localhost',
	dialect: 'mysql'
});

module.exports = connection;