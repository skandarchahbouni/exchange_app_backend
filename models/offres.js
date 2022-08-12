class Offre{
    constructor({id_offre, utilisateur, annonce, details, numero_de_telephone, createdAt, updatedAt}){
        this.id_offre = id_offre
        this.utilisateur = utilisateur
        this.annonce = annonce
        this.details = details
        this.numero_de_telephone = numero_de_telephone
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
    async save(){

    }
    static async findAll(){

    }
}

module.exports = Offre