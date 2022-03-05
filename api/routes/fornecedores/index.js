const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

roteador.get('/', async(req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    res.send(
        JSON.stringify(resultados)
    )
})

roteador.post('/', async (req,res) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        res.status(201)
        res.send(JSON.stringify(fornecedor))
    } catch (err) {
        // Dados incompletos ou requisicao mal formada
        res.status(400)
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
        // 404 = Nao encontrado
        res.status(404)
        res.send(
            JSON.stringify({ mensagem: err.message })
        )
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

roteador.delete('/:idFornecedor', async (req, res) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.buscar()
        await fornecedor.remover()
        res.status(204)
        resposta.end()
    } catch (err) {
        res.status(404)
        res.send(JSON.stringify({ mensagem: err.message })) 
    }
})

module.exports = roteador