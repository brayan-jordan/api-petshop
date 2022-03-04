const Sequelize = require('sequelize')
const config = require('config')

const instancia = new Sequelize(
    // nome da database, usuario, senha (nao necessariamente a senha do mysql)
    config.get('mysql.banco-de-dados'),
    config.get('mysql.usuario'),
    config.get('mysql.senha'),
    {
        host: config.get('mysql.host'),
        dialect: 'mysql'
    },
    
)

module.exports = instancia