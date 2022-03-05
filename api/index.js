const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./routes/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')

// body parser (biblioteca para trabalhar com formato json)
app.use(bodyParser.json())

app.use('/api/fornecedores', roteador)

app.use((err, req, res, proximo) => {
    if (err instanceof NaoEncontrado) {
        res.status(404)
    } else {
        res.status(400)
    }
    res.send(
        JSON.stringify({
             error: err.message, 
             id: err.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('Api running on port 3333'))