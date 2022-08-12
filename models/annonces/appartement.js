class Appartement{
    constructor({id_appartement, superficie, pieces, specification}){
        this.id_appartement = id_appartement
        this.superficie = superficie
        this.pieces = pieces
        this.specification = specification
    }
}

module.exports = Appartement