const db = require("../../config/db.config")
const category = require("../../helpers/categories")
const getCurrentDate = require("../../helpers/get_current_date")
const groupe_response = require("../../helpers/group_response")
const isEmpty = require("../../helpers/isEmpty")
const split_announce = require("../../helpers/split_announce")

const getAllPhones = async (req, res, next) => {
    const query = `
        SELECT * FROM Annonces an 
        INNER JOIN Telephones t ON an.id_annonce = t.id_telephone
        INNER JOIN Marques_automobiles m ON t.marque = m.id_marque
        INNER JOIN Photos p ON p.annonce = an.id_annonce
    `
    try {
        const [response, _] = await db.execute(query)
        const phones = groupe_response(response)
        return res.status(200).json(phones)
    } catch (error) {
        return next(error)
    }
}

const getSinglePhone = async (req, res, next) => {
    const { id } = req.params
    const query = `
        SELECT * FROM Annonces an 
        INNER JOIN Telephones t ON an.id_annonce = t.id_telephone
        INNER JOIN Marques_automobiles m ON t.marque = m.id_marque
        INNER JOIN Photos p ON p.annonce = an.id_annonce
        WHERE an.id_annonce = ?
    `
    try {
        const [response] = await db.execute(query, [id])
        if (response.length === 0) {
            return res.status(200).json("not found")
        }
        // const photos = []
        // response.forEach(element => photos.push(element.lien_photo))
        // const phone = response[0]
        // delete phone.lien_photo
        // delete phone.id_photo
        // delete phone.id_marque
        // delete phone.annonce
        // phone.photos = photos

        const phone = groupe_response(response)
        return res.status(200).json(phone[0])
    } catch (error) {
        return next(error)
    }
}

const addPhone = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const [announce, phone] = split_announce(req.body, category.phone)
    announce.utilisateur = id_utilisateur
    const current_date = getCurrentDate()
    announce.createdAt = current_date
    announce.updatedAt = current_date

    // announce.category = 2 do we have to do this ?
    delete phone.id_telephone
    delete announce.id_annonce // bcz it's auto increment ?

    const [announce_attributes, announce_values] = [Object.keys(announce), Object.values(announce)]
    const [phone_attributes, phone_values] = [Object.keys(phone), Object.values(phone)]

    const ann_arr = new Array(announce_attributes.length).fill('?')
    const phone_arr = new Array(phone_attributes.length).fill('?')

    const query_1 = `
        INSERT INTO Annonces (${announce_attributes})
        VALUES(${ann_arr});
    `
    const query_2 = `
        INSERT INTO Telephones(id_telephone, ${phone_attributes}) 
        VALUES(LAST_INSERT_ID(), ${phone_arr});
    `

    let connection

    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [{ insertId }] = await connection.execute(query_1, announce_values)
        await connection.execute(query_2, phone_values)
        await connection.commit()
        return res.status(201).json({ insertId })
    } catch (error) {
        connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

const updatePhone = async (req, res, next) => {

    const { id } = req.params
    const [announce, phone] = split_announce(req.body, category.phone)
    delete announce.createdAt
    delete announce.id_annonce
    delete announce.utilisateur
    delete phone.id_telephone


    if (isEmpty(announce) && isEmpty(phone)) {
        return res.status(200).json("everything up-to-date")
    }

    const current_date = getCurrentDate()
    announce.updatedAt = current_date

    let announce_attributes = Object.keys(announce)
    announce_attributes = announce_attributes.map(i => i = "an." + i + " = ?")
    const announce_values = Object.values(announce)

    if (isEmpty(phone)) {
        // join not necessary 
        const query = `
                UPDATE Annonces an 
                SET ${announce_attributes}
                WHERE an.id_annonce = ${id}
            `
        try {
            await db.execute(query, announce_values)
            return res.status(200).json("everything up-to-date")
        } catch (error) {
            return next(error)
        }
    }

    let phone_attributes = Object.keys(phone)
    phone_attributes = phone_attributes.map(i => i = "t." + i + " = ?")
    const phone_values = Object.values(phone)

    const attributes = announce_attributes.concat(phone_attributes)
    const values = announce_values.concat(phone_values)

    const query = `
        UPDATE Annonces an INNER JOIN Telephones t ON an.id_annonce = t.id_telephone
        SET ${attributes}
        WHERE an.id_annonce = ${id};
    `

    try {
        await db.execute(query, values)
        return res.status(200).json("everything up-to-date")
    } catch (error) {
        return next(error)
    }
}

const deletePhone = async (req, res, next) => {
    const { id } = req.params
    const query = "DELETE FROM Annonces WHERE id_annonce = ?"
    try {
        await db.execute(query, [id])
        return res.status(200).json("deleted succesfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllPhones,
    deletePhone,
    updatePhone,
    addPhone,
    getSinglePhone
}