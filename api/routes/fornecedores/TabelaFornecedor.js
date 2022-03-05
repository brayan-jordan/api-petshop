const ModeloTabela = require('./ModeloTabelaFornecedor')
const NaoEncontrado = require('../../erros/NaoEncontrado')

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
            throw new NaoEncontrado()
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
    },

    async remover (id) {
        return await ModeloTabela.destroy({
            where: {
                id: id
            }
        })
    }
}