const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.options('/', (req, res) => {
    res.set('Acess-Control-Allow-Methods', 'GET', 'POST')
    res.set('Acess-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/', async(req, res) => {
    const resultados = await TabelaFornecedor.listar()
    res.status(200)
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type'),
        ['empresa']
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
            res.getHeader('Content-Type'),
            ['empresa']
        )
        res.send(serializador.serializar(fornecedor))
    } catch (err) {
        proximo(err)
    }
})

roteador.options('/:idFornecedor', (req, res) => {
    res.set('Acess-Control-Allow-Methods', 'GET', 'PUT', 'DELETE')
    res.set('Acess-Control-Allow-Headers', 'Content-Type')
    res.status(204)
    res.end()
})

roteador.get('/:idFornecedor', async (req, res, proximo) => {
    try {
        const idFornecedor = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: idFornecedor })
        await fornecedor.buscar()
        res.status(200)
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'empresa', 'dataCriacao', 'dataAtualizacao', 'versao']
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

// Chamando o index.js dos produtos que sao uma classe dentro dos fornecedores (possibilitando o uso de suas rotas)
const roteadorProdutos = require('./produtos')

// Middleware para verificar se fornecedor existe em todas as rotas de produtos que necessitam existir um fornecedor
// para conseguir usar suas funcionalidades (evitando erros de uma forma mais pratica)
const verificarFornecedor = async (req, res, proximo) => {
    try {
        const id = req.params.idFornecedor
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.buscar()
        req.fornecedor = fornecedor
        proximo()
    } catch (err) {
        proximo(err)
    }
}

// Verifica fornecedor (SEGUNDO PARAMETRO), e conhecido como um middleware que vai ser utilizado em todas as rotas desse roteador.use
// antes de ir para a rota escolhida dentro de roteador produtos, isso porque esse middleware esta passando primeiro como parametro
roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos)

module.exports = roteador