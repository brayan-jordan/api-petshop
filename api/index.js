const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const roteador = require('./routes/fornecedores')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const formatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErros = require('./Serializador').SerializadorErros

// body parser (biblioteca para trabalhar com formato json)
app.use(bodyParser.json())

app.use((req, res, proximo) => {
    let formatoRequisitado = req.header('Accept')

    if (formatoRequisitado = '*/*') {
        formatoRequisitado = 'application/json'
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406)
        res.end()
        return
    }

    res.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use((req, res, proximo) => {
    res.set('Access-Control-Allow-Origin', '*')
    proximo()
})

app.use('/api/fornecedores', roteador)

const roteadorV2 = require('./routes/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2)

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

    const serializador = new SerializadorErros(
        res.getHeader('Content-Type')
    )

    res.status(status)
    res.send(
        serializador.serializar({
             message: err.message, 
             id: err.idErro
        })
    )
})

app.listen(config.get('api.porta'), () => console.log('Api running on port 3333'))