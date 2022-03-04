const ModeloTabela = require('./ModeloTabelaFornecedor')

module.exports = {
    listar () {
        return ModeloTabela.findAll()
    },

    inserir (fornecedor) {
        return ModeloTabela.create(fornecedor)
    },

    async buscarPorId (id) {
        const encontrado = await ModeloTabela.findOne({
            where: {
                id: id
            }
        })

        if (!encontrado) {
            throw new Error('Fornecedor nao encontrado com o ID ' + id)
        }

        return encontrado
    },

    async atualizar(id, dadosParaAtualizar) {
        return ModeloTabela.update(
            dadosParaAtualizar,
            {
                where: { id: id }
            }
        )
    }
}