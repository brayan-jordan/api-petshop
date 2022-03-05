const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./routes/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')

// body parser (biblioteca para trabalhar com formato json)
app.use(bodyParser.json())

app.use('/api/fornecedores', roteador)

app.use((err, req, res, proximo) => {
    let status = 500

    if (err instanceof NaoEncontrado) {
        status = 404
    } 

    if (err instanceof CampoInvalido || err instanceof DadosNaoFornecidos) {
        status = 400
    }

    if (err instanceof ValorNaoSuportado) {
        // Tipo de valor que o cliente esta pedindo nao e suportado pela api
        status = 406
    }

    res.status(status)
    res.send(
        JSON.stringify({
             error: err.message, 
             id: err.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('Api running on port 3333'))