const db = require("../config/db.config")
const getCurrentDate = require("../helpers/get_current_date")
const isEmpty = require("../helpers/isEmpty")
const remove_undefined_attributes = require("../helpers/remove_undefined")
const Offre = require("../models/offres")

const create_offer = async (req, res, next) => {
    // utilisateur, annonce, numero_de_telephone, createdAt, updatedAt
    const { id_utilisateur } = req.user
    let offer = new Offre(req.body)
    offer = remove_undefined_attributes(offer)
    delete offer.id_offre
    offer.utilisateur = id_utilisateur

    const current_date = getCurrentDate()
    offer.createdAt = current_date
    offer.updatedAt = current_date

    const attributes = Object.keys(offer)
    const values = Object.values(offer)

    const arr = new Array(attributes.length).fill('?')

    const query = `
        INSERT INTO Offres(${attributes}) VALUES (${arr})
    `

    try {
        const [{ insertId }] = await db.execute(query, values)
        return res.status(201).json(insertId)
    } catch (error) {
        return next(error)
    }
}

const getAllOffers = async (req, res, next) => {
    const { annonce } = req.query
    let query
    if (Number(annonce)) {
        const id_annonce = Number(annonce)
        query = `
            SELECT * FROM Offres WHERE annonce = ${id_annonce}
            ORDER BY updatedAt DESC
        `
    } else {
        query = "SELECT * FROM Offres"
    }
    try {
        const [offers] = await db.execute(query)
        return res.json(offers)
    } catch (error) {
        return next(error)
    }
}

const getRecievedOffers = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const query = `
        SELECT o.* FROM Offres o 
        INNER JOIN Annonces an ON an.id_annonce = o.annonce
        WHERE an.utilisateur = ?
    `
    try {
        const [response, _] = await db.execute(query, [id_utilisateur])
        return res.status(200).json({nb_hits: response.length, data: response})
    } catch (error) {
        return next(error)
    }
}

const getSubmittedOffers = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const query = `
        SELECT * FROM offres Where utilisateur = ?
    `
    try {
        const [response, _] = await db.execute(query, [id_utilisateur])
        return res.status(200).json({nb_hits: response.length , data: response})
    } catch (error) {
        return next(error)
    }
}

const getSingleOffer = async (req, res, next) => {
    const { id } = req.params
    const query = "SELECT * FROM Offres Where id_offre = ?"
    try {
        const [offer] = await db.execute(query, [id])
        if (offer.length === 0) {
            return res.status(200).json("not found")
        }
        return res.status(200).json(offer[0])
    } catch (error) {
        return next(error)
    }
}

const updateOffer = async (req, res, next) => {
    const { id } = req.params
    let offer = {
        details: req.body.details,
        numero_de_telephone: req.body.numero_de_telephone
    }

    offer = remove_undefined_attributes(offer)

    if (isEmpty(offer)) {
        return res.status(200).json("everythin-up-to-date")
    }

    offer.updatedAt = getCurrentDate()

    let attributes = Object.keys(offer)
    attributes = attributes.map(att => att + "=?")

    const values = Object.values(offer)

    const query = `
        UPDATE Offres SET ${attributes} WHERE id_offre = ${id}
    `
    try {
        await db.execute(query, values)
        return res.status(200).json("everythin-up-to-date")
    } catch (error) {
        return next(error)
    }
}

const removeOffer = async (req, res, next) => {
    const { id } = req.params
    const query = "DELETE FROM Offres WHERE id_offre = ?"
    try {
        await db.execute(query, [id])
        return res.status(200).json("Offer removed succesfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    create_offer,
    getAllOffers,
    getRecievedOffers,
    getSubmittedOffers,
    getSingleOffer,
    updateOffer,
    removeOffer
}