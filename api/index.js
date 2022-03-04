const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./routes/fornecedores')

// body parser (biblioteca para trabalhar com formato json)
app.use(bodyParser.json())

app.use('/api/fornecedores', roteador)

app.listen(config.get('api.porta'), () => console.log('Api running on port 3333'))