class Store{
    constructor(id_store, nom_store, latitude, longitude, numero_de_telephone, wilaya, adresse, facebook, instagram, photo, createdAt, updatedAt){
        this.id_store = id_store
        this.nom_store = nom_store
        this.latitude = latitude
        this.longitude = longitude
        this.numero_de_telephone = numero_de_telephone
        this.wilaya = wilaya
        this.adresse = adresse
        this.photo = photo
        this.facebook = facebook
        this.instagram = instagram
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
    async save(){

    }
    static async findAll(){

    }
}