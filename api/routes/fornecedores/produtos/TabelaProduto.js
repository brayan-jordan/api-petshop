const ModeloTabelaProduto = require('./ModeloTabelaProduto')

module.exports = {
    listar(idFornecedor) {
        return ModeloTabelaProduto.findAll({
            where: {
                fornecedor: idFornecedor
            },
            // Raw = true, faz com que retorne os dados em javascript puro, caso contrario retornaria como uma instancia do Sequelize `
            raw: true
        })
    },

    inserir(dados) {
        return ModeloTabelaProduto.create(dados)
    },

    deletar(idProduto, idFornecedor) {
        return ModeloTabelaProduto.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            }
        })
    },

    async buscarPorId(idProduto, idFornecedor) {
        const encontrado = await ModeloTabelaProduto.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor
            },
            raw: true
        })

        if(!encontrado) {
            throw new Error('Produto nao foi encontrado')
        }

        return encontrado
    }
}