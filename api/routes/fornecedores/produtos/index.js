// MergeParans serve para fazer um merge com o roteador que esta acima (no caso que esta instanciando ele) 
// que nesse exemplo e o Roteador de fornecedor
const roteador = require('express').Router({ mergeParams: true })
const TabelaProduto = require('./TabelaProduto')
const Produto = require('./Produto')
const { Json } = require('sequelize/types/utils')

roteador.get('/', async (req, res) => {
    const produtos = await TabelaProduto.listar(req.fornecedor.id)
    res.send(
        JSON.stringify(produtos)
    )
})

roteador.post('/', async (req, res, proximo) => {
    try {
        const idFornecedor = req.fornecedor.id
        const corpo = req.body
        const dados = Object.assign({}, corpo, {fornecedor: idFornecedor})
        const produto = new Produto(dados)
        await produto.criar()
        res.status(201)
        res.send(produto)
    } catch (err) {
        proximo(err)
    }
})

roteador.delete('/:idProduto', async (req, res) => {
    const dados = {
        id: req.params.idProduto,
        fornecedor: req.fornecedor.id
    }

    const produto = new Produto(dados)
    await produto.remover()
    res.status(204)
    res.end()
})

roteador.get('/:idProduto', async (req, res, proximo) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        res.send(JSON.stringify(produto))
    } catch (err) {
        proximo(err)
    }
})

module.exports = roteador