const db = require("../../config/db.config")
const category = require("../../helpers/categories")
const getCurrentDate = require("../../helpers/get_current_date")
const groupe_response = require("../../helpers/group_response")
const isEmpty = require("../../helpers/isEmpty")
const split_announce = require("../../helpers/split_announce")

const getAllCars = async (req, res, next) => {

    // announce => wilaya, updatedAt, decription  
    // car => nom_auto, marque, energie, kilometrage, couleur, boite, papier

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 1
    const skip = (page - 1) * limit

    const [announce, car] = split_announce(req.query, category.car)

    // Announce : add veut_echanger_par
    let { wilaya, decription } = announce
    let attributes = []

    if (wilaya) {
        // wilaya=1,2,3
        wilaya = wilaya.split(',').map(Number).filter(e => e)
        if (wilaya.length > 0) attributes.push(`an.wilaya in ( ${wilaya} )`)
    }

    if (decription) {

    }

    // marque 
    // const {nom_auto, marque, energie, kilometrage, couleur, boite, papier} = car

    if (car.nom_auto) {
        // ? or how sql injection risk 
        const nom_auto = "'" + String(car.nom_auto).trim() + "'"
        attributes.push("au.nom_auto = " + nom_auto)
    }

    if (car.marque) {
        const marque = "'" + String(car.marque).trim() + "'"
        attributes.push(`m.nom_marque = ${marque}`)
    }
    if (car.energie) {
        const energie = car.energie.split(',').map(e => "'" + e.trim() + "'")
        attributes.push(`au.energie in ( ${energie})`)
    }
    if (car.kilometrage) {
        const kilometrage = car.kilometrage.split('-').map(Number)
        if (kilometrage.length === 2) {
            if (!Number.isNaN(kilometrage[0])) {
                attributes.push(`au.kilometrage >= ${kilometrage[0]}`)
            }
            if (!Number.isNaN(kilometrage[1])) {
                attributes.push(`au.kilometrage <= ${kilometrage[1]}`)
            }
        }
    }
    if (car.couleur) {
        const couleur = car.couleur.split(',').map(c => "'" + c.trim() + "'")
        attributes.push(`au.couleur in ( ${couleur} )`)
    }
    if (car.boite) {
        const boite = car.boite.split(',').map(b => "'" + b.trim() + "'")
        attributes.push(`au.boite in ( ${boite} )`)
    }
    if (car.papier) {
        const papier = car.papier.split(',').map(p => "'" + p.trim() + "'")
        attributes.push(`au.papier in (${papier})`)
    }

    // Marques_automobiles
    let query

    if (attributes.length === 0) {
        query = `
            SELECT * FROM Annonces an 
            INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
            INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
            INNER JOIN Photos p ON p.annonce = an.id_annonce 
            INNER JOIN Wilaya w ON an.wilaya = w.id_wilaya
            GROUP BY an.id_annonce 
            ORDER BY an.updatedAt DESC
            LIMIT ${limit} OFFSET ${skip}
        `
    } else {
        attributes = attributes.join(' AND ')
        query = `
            SELECT * FROM Annonces an 
            INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
            INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
            INNER JOIN Photos p ON p.annonce = an.id_annonce 
            INNER JOIN Wilaya w ON an.wilaya = w.id_wilaya
            WHERE ${attributes}
            GROUP BY an.id_annonce 
            ORDER BY an.updatedAt DESC
            LIMIT ${limit} OFFSET ${skip}
    `
    }
    try {
        const [response, _] = await db.execute(query)
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}

const getSingleCar = async (req, res) => {
    const { id } = req.params
    const query = `
        SELECT * FROM Annonces an 
        INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
        INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
        INNER JOIN Photos p ON p.annonce = an.id_annonce 
        INNER JOIN wilaya w ON w.id_wilaya = an.wilaya
        WHERE an.id_annonce = ?
    `
    try {
        const [response] = await db.execute(query, [id])
        if (response.length === 0) {
            return res.status(404).json("car not found")
        }
        const car = groupe_response(response)
        return res.status(200).json(car[0])
    } catch (error) {
        return next(error)
    }
}

const addCar = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const [announce, car] = split_announce(req.body, category.car)
    announce.utilisateur = id_utilisateur
    const current_date = getCurrentDate()
    announce.createdAt = current_date
    announce.updatedAt = current_date
    // TODO 
    // announce.category = 2 do we have to do this ?
    delete car.id_automobile
    delete announce.id_annonce // bcz it's auto increment ?

    const [announce_attributes, announce_values] = [Object.keys(announce), Object.values(announce)]
    const [car_attributes, car_values] = [Object.keys(car), Object.values(car)]

    const ann_arr = new Array(announce_attributes.length).fill('?')
    const car_arr = new Array(car_attributes.length).fill('?')

    // foreign keys => wilaya, marque automobiles, nom automobiles 
    const query_1 = `
        INSERT INTO Annonces (${announce_attributes})
        VALUES(${ann_arr});
    `
    const query_2 = `
        INSERT INTO Automobiles(id_automobile, ${car_attributes}) 
        VALUES(LAST_INSERT_ID(), ${car_arr});
    `

    let connection

    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [{ insertId }] = await connection.execute(query_1, announce_values)
        await connection.execute(query_2, car_values)
        await connection.commit()
        return res.status(201).json({ insertId })
    } catch (error) {
        connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

const updateCar = async (req, res, next) => {
    const { id } = req.params
    const [announce, car] = split_announce(req.body, category.car)
    delete announce.createdAt
    delete announce.id_annonce
    delete announce.utilisateur
    delete car.id_automobile

    if (isEmpty(announce) && isEmpty(car)) {
        return res.status(200).json("everything up-to-date")
    }

    const current_date = getCurrentDate()
    announce.updatedAt = current_date

    let announce_attributes = Object.keys(announce)
    announce_attributes = announce_attributes.map(i => i = "an." + i + " = ?")
    const announce_values = Object.values(announce)

    if (isEmpty(car)) {
        // join not necessary 
        const query = `
                UPDATE Annonces an 
                SET ${announce_attributes}
                WHERE an.id_annonce = ${id}
            `
        try {
            await db.execute(query, announce_values)
            return res.status(201).json("everything up-to-date")
        } catch (error) {
            return next(error)
        }
    }

    let car_attributes = Object.keys(car)
    car_attributes = car_attributes.map(i => i = "au." + i + " = ?")
    const car_values = Object.values(car)

    const attributes = announce_attributes.concat(car_attributes)
    const values = announce_values.concat(car_values)

    const query = `
        UPDATE Annonces an INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
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

const deleteCar = async (req, res, next) => {
    const { id } = req.params
    const query = "DELETE FROM Annonces WHERE id_annonce = ?" // CASCADE 
    try {
        await db.execute(query, [id])
        return res.status(200).json("car had been deleted succesfully")
    } catch (error) {
        return next(error)
    }
}

const getCarsMarks = async (req, res, next) => {
    const query = `
        SELECT * FROM Marques_automobiles 
    `
    try {
        const [marks, _] = await db.execute(query)
        res.status(200).json(marks)
    } catch (error) {
        return next(error)
    }
}

const getCarsNames = async (req, res, next) => {
    const query = `
        SELECT DISTINCT nom_auto FROM Automobiles
    `
    try {
        const [cars, _] = await db.execute(query)
        return res.status(200).json(cars)
    } catch (error) {
        return next(error)
    }
}

const getWilayas = async (req, res)=>{
    const [wilayas, _] = await db.execute("SELECT * FROM wilaya")
    return res.status(200).json(wilayas)
}


const getNbCars = async (req, res, next) => {

    // announce => wilaya, updatedAt, decription  
    // car => nom_auto, marque, energie, kilometrage, couleur, boite, papier

    const [announce, car] = split_announce(req.query, category.car)

    // Announce : add veut_echanger_par
    let { wilaya, decription } = announce
    let attributes = []

    if (wilaya) {
        // wilaya=1,2,3
        wilaya = wilaya.split(',').map(Number).filter(e => e)
        if (wilaya.length > 0) attributes.push(`an.wilaya in ( ${wilaya} )`)
    }

    if (decription) {

    }

    // marque 
    // const {nom_auto, marque, energie, kilometrage, couleur, boite, papier} = car

    if (car.nom_auto) {
        // ? or how sql injection risk 
        const nom_auto = "'" + String(car.nom_auto).trim() + "'"
        attributes.push("au.nom_auto = " + nom_auto)
    }

    if (car.marque) {
        const marque = "'" + String(car.marque).trim() + "'"
        attributes.push(`m.nom_marque = ${marque}`)
    }
    if (car.energie) {
        const energie = car.energie.split(',').map(e => "'" + e.trim() + "'")
        attributes.push(`au.energie in ( ${energie})`)
    }
    if (car.kilometrage) {
        const kilometrage = car.kilometrage.split('-').map(Number)
        if (kilometrage.length === 2) {
            if (!Number.isNaN(kilometrage[0])) {
                attributes.push(`au.kilometrage >= ${kilometrage[0]}`)
            }
            if (!Number.isNaN(kilometrage[1])) {
                attributes.push(`au.kilometrage <= ${kilometrage[1]}`)
            }
        }
    }
    if (car.couleur) {
        const couleur = car.couleur.split(',').map(c => "'" + c.trim() + "'")
        attributes.push(`au.couleur in ( ${couleur} )`)
    }
    if (car.boite) {
        const boite = car.boite.split(',').map(b => "'" + b.trim() + "'")
        attributes.push(`au.boite in ( ${boite} )`)
    }
    if (car.papier) {
        const papier = car.papier.split(',').map(p => "'" + p.trim() + "'")
        attributes.push(`au.papier in (${papier})`)
    }

    // Marques_automobiles
    let query

    if (attributes.length === 0) {
        query = `
            SELECT COUNT(*) nb_results FROM (
                SELECT DISTINCT an.id_annonce FROM Annonces an 
                INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
                INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
                INNER JOIN Photos p ON p.annonce = an.id_annonce 
            ) d
        `
    } else {
        attributes = attributes.join(' AND ')
        query = `
            SELECT COUNT(*) nb_results FROM (
                SELECT DISTINCT an.id_annonce FROM Annonces an 
                INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
                INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
                INNER JOIN Photos p ON p.annonce = an.id_annonce 
                WHERE ${attributes}
            ) d
    `
    }
    try {
        const [response, _] = await db.execute(query)
        return res.status(200).json(response[0].nb_results)
    } catch (error) {
        return next(error)
    }
}

// const addWilaya = async (req, res, next) => {
//     const { nom_wilaya } = req.body
//     const query = "insert ignore into Wilaya(nom_wilaya) values (?)"
//     try {
//         const [{ insertId }] = await db.execute(query, [nom_wilaya])
//         return res.status(200).json(insertId)
//     } catch (error) {
//         return next(error)
//     }
// }

const getNbCARS = async (req, res, next) => {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 1
    const skip = (page - 1) * limit

    const [announce, car] = split_announce(req.query, category.car)

    // Announce : add veut_echanger_par
    let { wilaya, decription } = announce
    let attributes = []

    if (wilaya) {
        // wilaya=1,2,3
        wilaya = wilaya.split(',').map(Number).filter(e => e)
        if (wilaya.length > 0) attributes.push(`an.wilaya in ( ${wilaya} )`)
    }

    if (decription) {

    }


    // marque 
    // const {nom_auto, marque, energie, kilometrage, couleur, boite, papier} = car

    if (car.nom_auto) {
        // ? or how sql injection risk 
        const nom_auto = "'" + String(car.nom_auto).trim() + "'"
        attributes.push("au.nom_auto = " + nom_auto)
    }

    if (car.marque) {
        const marque = "'" + String(car.marque).trim() + "'"
        attributes.push(`m.nom_marque = ${marque}`)
    }
    if (car.energie) {
        const energie = car.energie.split(',').map(e => "'" + e.trim() + "'")
        attributes.push(`au.energie in ( ${energie})`)
    }
    if (car.kilometrage) {
        const kilometrage = car.kilometrage.split('-').map(Number)
        if (kilometrage.length === 2) {
            if (!Number.isNaN(kilometrage[0])) {
                attributes.push(`au.kilometrage >= ${kilometrage[0]}`)
            }
            if (!Number.isNaN(kilometrage[1])) {
                attributes.push(`au.kilometrage <= ${kilometrage[1]}`)
            }
        }
    }
    if (car.couleur) {
        const couleur = car.couleur.split(',').map(c => "'" + c.trim() + "'")
        attributes.push(`au.couleur in ( ${couleur} )`)
    }
    if (car.boite) {
        const boite = car.boite.split(',').map(b => "'" + b.trim() + "'")
        attributes.push(`au.boite in ( ${boite} )`)
    }
    if (car.papier) {
        const papier = car.papier.split(',').map(p => "'" + p.trim() + "'")
        attributes.push(`au.papier in (${papier})`)
    }

    // Marques_automobiles
    let query

    if (attributes.length === 0) {
        query = `
            SELECT COUNT(*) nb_cars FROM (
                SELECT DISTINCT an.id_annonce FROM Annonces an 
                JOIN Automobiles au ON an.id_annonce = au.id_automobile
                INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
                INNER JOIN Photos p ON p.annonce = an.id_annonce 
            ) d
        `
    } else {
        attributes = attributes.join(' AND ')
        query = `
        SELECT COUNT(*) nb_cars FROM (
            SELECT DISTINCT an.id_annonce FROM Annonces an 
            INNER JOIN Automobiles au ON an.id_annonce = au.id_automobile
            INNER JOIN Marques_automobiles m ON m.id_marque = au.marque
            INNER JOIN Photos p ON p.annonce = an.id_annonce 
            WHERE ${attributes}
        ) d
    `
    }
    try {
        const [response, _] = await db.execute(query)
        return res.status(200).json(response[0].nb_cars)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllCars,
    deleteCar,
    updateCar,
    addCar,
    getSingleCar,
    getCarsMarks,
    getCarsNames,
    getNbCars,
    // addWilaya
    getWilayas
}