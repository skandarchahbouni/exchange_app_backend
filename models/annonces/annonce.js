class Annonce{
    constructor({id_annonce, utilisateur, numero_de_telephone, echange_avec, wilaya, description ,createdAt, updatedAt}){
        this.id_annonce = id_annonce
        this.utilisateur = utilisateur
        this.numero_de_telephone = numero_de_telephone
        this.echange_avec = echange_avec
        this.wilaya = wilaya
        this.description = description
        this.createdAt = createdAt
        this.updatedAt = updatedAt

    }
    async save(){

    }
    static async findAll(){

    }
}

module.exports = Annonce