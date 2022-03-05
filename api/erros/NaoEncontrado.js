class NaoEncontrado extends Error {
    constructor () {
        super('Fornecedor nao foi encontrado')
        this.name = 'NaoEncontrado'
        this.idErro = 0
    }
}

module.exports = NaoEncontrado