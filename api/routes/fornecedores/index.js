const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor


roteador.get('/', async(req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type')
    )
    res.send(
        serializador.serializar(resultados)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        res.status(201)
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type')
        )
        res.send(serializador.serializar(fornecedor))
    } catch (err) {
        proximo(err)
    }
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.buscar()
        res.status(200)
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type')
        )
        res.send(serializador.serializar(fornecedor))
    } catch (err) {
        proximo(err)
    }
})

roteador.put('/:idFornecedor', async (req, res, proximo) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: idFornecedor})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.status(204)
        res.end()    
    } catch (err) {
        proximo(err)
    }
})

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.buscar()
        await fornecedor.remover()
        res.status(204)
        resposta.end()
    } catch (err) {
        proximo(err)
    }
})

module.exports = roteador