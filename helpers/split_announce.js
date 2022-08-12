const Annonce = require('../models/annonces/annonce')
const Appartement = require('../models/annonces/appartement')
const Automobile = require('../models/annonces/automobile')
const Compte_reseaux_sociaux_et_gaming = require('../models/annonces/compte_reseau_sociaux_&_gaming')
const Telephone = require('../models/annonces/telephone')
const remove_undefined_attributes = require('./remove_undefined')
const category = require('./categories')

const split_announce = (obj, type) => {
    let announce = new Annonce(obj)
    announce = remove_undefined_attributes(announce)
    let rest
    
    switch (type) {
        case category.apartment:
            rest = new Appartement(obj)
            break;
        case category.car:
            rest = new Automobile(obj)
            break;
        case category.phone:
            rest = new Telephone(obj)
            break;
        case category.accounts:
            rest = new Compte_reseaux_sociaux_et_gaming(obj)
    }
    rest = remove_undefined_attributes(rest)
    return [announce, rest]
}

module.exports = split_announce