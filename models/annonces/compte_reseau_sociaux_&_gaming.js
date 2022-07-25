class Compte_reseaux_sociaux_et_gaming{
    constructor(id_compte, nom_compte, type_compte, nombre_abonnees, interaction, date_de_creation, lien){
        this.id_compte = id_compte
        this.nom_compte = nom_compte
        this.type_compte = type_compte
        this.nombre_abonnees = nombre_abonnees
        this.interaction = interaction
        this.date_de_creation = date_de_creation
        this.lien = lien
    }
    async save(){

    }
    static async findAll(){

    }
}