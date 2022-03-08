const ModeloTabelaProduto = require('./ModeloTabelaProduto')

module.exports = {
    listar(idFornecedor) {
        return ModeloTabelaProduto.findAll({
            where: {
                fornecedor: idFornecedor
            }
        })
    },

    inserir(dados) {
        return ModeloTabelaProduto.create(dados)
    }
}