// MergeParans serve para fazer um merge com o roteador que esta acima (no caso que esta instanciando ele) 
// que nesse exemplo e o Roteador de fornecedor
const roteador = require('express').Router({ mergeParams: true })
const TabelaProduto = require('./TabelaProduto')
const Produto = require('./Produto')
const Serializador = require('../../../Serializador').SerializadorProduto

roteador.get('/', async (req, res) => {
    const produtos = await TabelaProduto.listar(req.fornecedor.id)
    const serializador = new Serializador(
        res.getHeader('Content-Type')
    )
    res.send(
        serializador.serializar(produtos)
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
        res.set('ETAG', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.set('Location', `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`)
        const serializador = new Serializador(
            res.getHeader('Content-Type')
        )
        serializador.serializar(produto)
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
        const serializador = new Serializador(
            res.getHeader('Content-Type'),
            ['preco', 'estoque', 'fornecedor','dataCriacao', 'dataAtualizacao', 'versao']
        )
        res.set('ETAG', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.send(serializador.serializar(produto))
    } catch (err) {
        proximo(err)
    }
})

roteador.head('/:idProduto', async (req, res, proximo) => {
    try {
        const dados = {
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        }
    
        const produto = new Produto(dados)
        await produto.carregar()
        res.set('ETAG', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(200)
        res.end()
    } catch (err) {
        proximo(err)
    }
})

roteador.put('/:idProduto', async (req, res, proximo) => {
    try {
        const dados = Object.assign(
            {},
            req.body,
            {
                id: req.params.idProduto,
                fornecedor: req.fornecedor.id
            }
        )
    
        const produto = new Produto(dados)
        await produto.atualizar()
        // Carregar serve diretamente para pegar a nova versao e mandar nos cabecalhos
        await produto.carregar()
        res.set('ETAG', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(204)
        res.end()
    } catch (err) {
        proximo(err)
    }
})

roteador.post('/:idProduto/diminuirEstoque', async (req, res, proximo) => {
    try {
        const produto = new Produto({
            id: req.params.idProduto,
            fornecedor: req.fornecedor.id
        })
    
        await produto.carregar()
        produto.estoque = produto.estoque - req.body.quantidade
        await produto.diminuirEstoque()
        // Carregar serve diretamente para pegar a nova versao e mandar nos cabecalhos
        await produto.carregar()
        res.set('ETAG', produto.versao)
        const timestamp = (new Date(produto.dataAtualizacao)).getTime()
        res.set('Last-Modified', timestamp)
        res.status(204)
        res.end()
    } catch (err) {
        proximo(err)
    }
})

module.exports = roteador