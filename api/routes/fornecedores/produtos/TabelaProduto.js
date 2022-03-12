const ModeloTabelaProduto = require('./ModeloTabelaProduto')
const instancia = require('../../../banco-de-dados')
const NaoEncontrado = require('../../../erros/NaoEncontrado')

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
            throw new NaoEncontrado('Produto')
        }

        return encontrado
    },

    atuatlizar(dadosDoProduto, dadosParaAtualizar) {
        return ModeloTabelaProduto.update(
            dadosParaAtualizar,
            {
                where: dadosDoProduto
            }
        )
    },

    subtrair(idProduto, idFornecedor, campo, quantidade) {
        return instancia.transaction(async transacao => {
            const produto = await ModeloTabelaProduto.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor
                }
            })

            produto[campo] = quantidade

            await produto.save()

            return
        })
    }
}