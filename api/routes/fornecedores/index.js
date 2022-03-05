const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')

roteador.get('/', async(req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    res.send(JSON.stringify(resultados))
})

roteador.post('/', async (req,res) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        res.status(201)
        res.send(JSON.stringify(fornecedor))
    } catch (err) {
        res.send(
            JSON.stringify({ mensagem: err.message })
        )
    }
})

roteador.get('/:idFornecedor', async (req, res) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.buscar()
        res.status(200)
        res.send(JSON.stringify(fornecedor))
    } catch (err) {
        res.send(
            JSON.stringify({ mensagem: err.message })
        )
    }
})

roteador.put('/:idFornecedor', async (req, res) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const dadosRecebidos = req.body
        const dados = Object.assign({}, dadosRecebidos, {id: idFornecedor})
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        res.end()    
    } catch (err) {
        res.send(JSON.stringify({ error: err.message }))
    }
    
})

roteador.delete('/:idFornecedor', async (req, res) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.buscar()
        await fornecedor.remover()
        resposta.end()
    } catch (err) {
        res.send(JSON.stringify({ mensagem: err.message })) 
    }
})

module.exports = roteador