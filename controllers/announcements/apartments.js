const db = require("../../config/db.config")
const getCurrentDate = require("../../helpers/get_current_date")
const isEmpty = require("../../helpers/isEmpty")
const split_announce = require("../../helpers/split_announce")
const category = require('../../helpers/categories')
const groupe_response = require("../../helpers/group_response")

const getAllApartments = async (req, res, next) => {

    // announce => wilaya, updatedAt, decription  
    // apartment => superficie, pieces, specification

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 1
    const skip = (page - 1) * limit

    const [announce, apartment] = split_announce(req.query, category.apartment)

    // Announce : add veut_echanger_par
    let { wilaya, decription } = announce
    let attributes = []

    if (wilaya) {
        // wilaya=1,2,3
        wilaya = wilaya.split(',').map(Number).filter(e => e)
        if (wilaya.length > 0) attributes.push(`an.wilaya in ( ${wilaya} )`)
    }

    // superficie, pieces, specification 
    let { superficie, pieces, specification } = apartment

    if (superficie) {
        // superficie = min - max
        superficie = superficie.split('-').map(Number)
        if (superficie.length === 2) {
            if (!Number.isNaN(superficie[0])) {
                attributes.push(`ap.superficie >= ${superficie[0]}`)
            }
            if (!Number.isNaN(superficie[1])) {
                attributes.push(`ap.superficie <= ${superficie[1]}`)
            }
        }
    }

    if (pieces) {
        // pieces = min - max
        pieces = pieces.split('-').map(Number)
        if (pieces.length === 2) {
            if (!Number.isNaN(pieces[0])) {
                attributes.push(`ap.pieces >= ${pieces[0]}`)
            }
            if (!Number.isNaN(pieces[1])) {
                attributes.push(`ap.pieces <= ${pieces[1]}`)
            }
        }
    }

    let query 

    if (attributes.length === 0){
        query = `
            SELECT * FROM Appartements ap 
            INNER JOIN Annonces an ON an.id_annonce = ap.id_appartement
            INNER JOIN Photos p ON p.annonce = an.id_annonce
            INNER JOIN Wilaya w ON an.wilaya = w.id_wilaya
            GROUP BY an.id_annonce 
            ORDER BY an.updatedAt DESC
            LIMIT ${limit} OFFSET ${skip}
        `
    }else{
        attributes = attributes.join(' AND ')
        query = `
            SELECT * FROM Appartements ap 
            INNER JOIN Annonces an ON an.id_annonce = ap.id_appartement
            INNER JOIN Photos p ON p.annonce = an.id_annonce
            INNER JOIN Wilaya w ON an.wilaya = w.id_wilaya
            WHERE ${attributes}
            GROUP BY an.id_annonce 
            ORDER BY an.updatedAt DESC
            LIMIT ${limit} OFFSET ${skip}
        `
    }


    try {
        // console.log(query, values)
        // console.log(attributes)
        // return res.json("ok")
        const [response, _] = await db.execute(query)
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}

const getSingleApartment = async (req, res, next) => {
    const { id } = req.params
    const query = `
        SELECT * FROM
            Appartements ap INNER JOIN Annonces an 
            ON an.id_annonce = ap.id_appartement
            INNER JOIN Photos p ON p.annonce = an.id_annonce
            INNER JOIN Wilaya w ON an.wilaya = w.id_wilaya
            WHERE ap.id_appartement = ?
    `
    try {
        const [response] = await db.execute(query, [id])
        if (response.length === 0) {
            return res.status(200).json("not found")
        }
        const apartment = groupe_response(response)
        return res.status(200).json(apartment[0])
    } catch (error) {
        return next(error)
    }
}

const addApartment = async (req, res, next) => {

    const { id_utilisateur } = req.user
    const [announce, apartment] = split_announce(req.body, category.apartment)
    announce.utilisateur = id_utilisateur
    const current_date = getCurrentDate()
    announce.createdAt = current_date
    announce.updatedAt = current_date
    delete announce.id_annonce // bcz it's auto increment ??
    // TODO 
    // announce.category = 4 do we have to do this ?
    delete apartment.id_appartement

    const [announce_attributes, announce_values] = [Object.keys(announce), Object.values(announce)]
    const [apartment_attributes, apartment_values] = [Object.keys(apartment), Object.values(apartment)]

    const ann_arr = new Array(announce_attributes.length).fill('?')
    const app_arr = new Array(apartment_attributes.length).fill('?')


    const query_1 = `
        INSERT INTO Annonces (${announce_attributes})
        VALUES(${ann_arr});
    `
    const query_2 = `
        INSERT INTO Appartements(id_appartement, ${apartment_attributes}) 
        VALUES(LAST_INSERT_ID(), ${app_arr});
    `

    let connection
    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [{ insertId }] = await connection.execute(query_1, announce_values)
        await connection.execute(query_2, apartment_values)
        await connection.commit()
        return res.status(201).json({ insertId })
    } catch (error) {
        await connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

const updateApartment = async (req, res, next) => {
    const { id } = req.params
    const [announce, apartment] = split_announce(req.body, category.apartment)
    delete announce.createdAt
    delete announce.id_annonce
    delete announce.utilisateur
    delete apartment.id_appartement
    // remarque 
    // what if he provides id_appartement != id_annonce => fatal 
    // it's possible to not delete id_annonce (cascade)

    if (isEmpty(announce) && isEmpty(apartment)) {
        return res.status(200).json("everything up-to-date")
    }

    const current_date = getCurrentDate()
    announce.updatedAt = current_date

    let announce_attributes = Object.keys(announce)
    announce_attributes = announce_attributes.map(i => i = "an." + i + " = ?")
    const announce_values = Object.values(announce)

    // Optimisation => avoid the join bcz it's not necessary 
    if (isEmpty(apartment)) {
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

    // the join is necessary, bcz the updatedAt attribute is in the Annonces table 
    let apartment_attributes = Object.keys(apartment)
    apartment_attributes = apartment_attributes.map(i => i = "ap." + i + " = ?")
    const apartment_values = Object.values(apartment)

    const attributes = announce_attributes.concat(apartment_attributes)
    const values = announce_values.concat(apartment_values)

    const query = `
        UPDATE Annonces an INNER JOIN Appartements ap ON an.id_annonce = ap.id_appartement
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

const deleteApartment = async (req, res, next) => {
    const { id } = req.params
    const query = "DELETE FROM Annonces WHERE id_annonce = ?"
    try {
        await db.execute(query, [id])
        res.json("deleted Successfully")
    } catch (error) {
        return next(error)
    }
}

const getNbApartments = async (req, res, next) => {

    const [announce, apartment] = split_announce(req.query, category.apartment)

    // Announce : add veut_echanger_par
    let { wilaya, decription } = announce
    let attributes = []

    if (wilaya) {
        // wilaya=1,2,3
        wilaya = wilaya.split(',').map(Number).filter(e => e)
        if (wilaya.length > 0) attributes.push(`an.wilaya in ( ${wilaya} )`)
    }

    // superficie, pieces, specification 
    let { superficie, pieces, specification } = apartment

    if (superficie) {
        // superficie = min - max
        superficie = superficie.split('-').map(Number)
        if (superficie.length === 2) {
            if (!Number.isNaN(superficie[0])) {
                attributes.push(`ap.superficie >= ${superficie[0]}`)
            }
            if (!Number.isNaN(superficie[1])) {
                attributes.push(`ap.superficie <= ${superficie[1]}`)
            }
        }

    }

    if (pieces) {
        // pieces = min - max
        pieces = pieces.split('-').map(Number)
        if (pieces.length === 2) {
            if (!Number.isNaN(pieces[0])) {
                attributes.push(`ap.pieces >= ${pieces[0]}`)
            }
            if (!Number.isNaN(pieces[1])) {
                attributes.push(`ap.pieces <= ${pieces[1]}`)
            }
        }
    }

    let query 

    if (attributes.length === 0){
        query = `
            SELECT COUNT(*) nb_apartments FROM (
                SELECT DISTINCT an.id_annonce FROM Appartements ap 
                INNER JOIN Annonces an ON an.id_annonce = ap.id_appartement
                INNER JOIN Photos p ON p.annonce = an.id_annonce
            ) d
        `
    }else{
        attributes = attributes.join(' AND ')
        query = `
            SELECT COUNT(*) nb_apartments FROM (
                SELECT DISTINCT an.id_annonce FROM Appartements ap 
                INNER JOIN Annonces an ON an.id_annonce = ap.id_appartement
                INNER JOIN Photos p ON p.annonce = an.id_annonce
                WHERE ${attributes}
            ) d
        `
    }


    try {
        // console.log(query, values)
        // console.log(attributes)
        // return res.json("ok")
        const [response, _] = await db.execute(query)
        return res.status(200).json(response[0].nb_apartments)
    } catch (error) {
        return next(error)
    }
}


module.exports = {
    getAllApartments,
    deleteApartment,
    updateApartment,
    addApartment,
    getSingleApartment,
    getNbApartments
}