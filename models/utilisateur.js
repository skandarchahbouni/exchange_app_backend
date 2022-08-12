const db = require('../config/db.config')

class Utilisateur {
    constructor({id_utilisateur, email, mot_de_passe, isAdmin, nom_utilisateur, prenom_utilisateur, numero_de_telephone, wilaya, adresse, facebook, instagram, photo, createdAt, updatedAt}) {
        this.id_utilisateur = id_utilisateur
        this.email = email
        this.mot_de_passe = mot_de_passe
        this.isAdmin = isAdmin
        this.nom_utilisateur = nom_utilisateur
        this.prenom_utilisateur = prenom_utilisateur
        this.numero_de_telephone = numero_de_telephone
        this.wilaya = wilaya
        this.adresse = adresse
        this.facebook = facebook
        this.photo = photo
        this.instagram = instagram
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    async save() {
    }

    static async findAll() {

    }
}
module.exports = Utilisateur