class Annonce{
    constructor(id_annonce, utilisateur, numero_de_telephone, wilaya, category, description ,createdAt, updatedAt){
        this.id_annonce = id_annonce
        this.utilisateur = utilisateur
        this.numero_de_telephone = numero_de_telephone
        this.wilaya = wilaya
        this.category = category
        this.description = description
        this.createdAt = createdAt
        this.updatedAt = updatedAt

    }
    async save(){

    }
    static async findAll(){

    }
}