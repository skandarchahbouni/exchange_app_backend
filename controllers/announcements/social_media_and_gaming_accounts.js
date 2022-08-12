const db = require("../../config/db.config")
const category = require("../../helpers/categories")
const getCurrentDate = require("../../helpers/get_current_date")
const groupe_response = require("../../helpers/group_response")
const isEmpty = require("../../helpers/isEmpty")
const split_announce = require("../../helpers/split_announce")

const getAllSocialAccounts = async (req, res, next) => {

    const query = `
        SELECT * FROM Annonces an 
        INNER JOIN Comptes_reseau_sociaux_et_gaming c ON an.id_annonce = c.id_compte
        INNER JOIN Photos p on p.annonce = an.id_annonce 
    `

    try {
        const [response, _] = await db.execute(query)
        const accounts = groupe_response(response)
        return res.status(200).json(accounts)
    } catch (error) {
        return next(error)
    }
}

const getSingleSocialAccount = async (req, res, next) => {
    const { id } = req.params

    const query = `
        SELECT * FROM Annonces an 
        INNER JOIN Comptes_reseau_sociaux_et_gaming c ON an.id_annonce = c.id_compte
        INNER JOIN Photos p on p.annonce = an.id_annonce 
        WHERE an.id_annonce = ?
    `
    try {
        const [response] = await db.execute(query, [id])
        if (response.length === 0) {
            return res.status(200).json("not found")
        }
        const account = groupe_response(response)
        return res.status(200).json(account[0])
    } catch (error) {
        return next(error)
    }
}

const addSocialAccount = async (req, res, next) => {

    const { id_utilisateur } = req.user
    const [announce, account] = split_announce(req.body, category.accounts)
    announce.utilisateur = id_utilisateur
    const current_date = getCurrentDate()
    announce.createdAt = current_date
    announce.updatedAt = current_date

    delete account.id_compte
    delete announce.id_annonce

    const [announce_attributes, announce_values] = [Object.keys(announce), Object.values(announce)]
    const [account_attributes, account_values] = [Object.keys(account), Object.values(account)]

    const ann_arr = new Array(announce_attributes.length).fill('?')
    const acc_arr = new Array(account_attributes.length).fill('?')

    const query_1 = `
        INSERT INTO Annonces (${announce_attributes})
        VALUES(${ann_arr});
    `
    const query_2 = `
        INSERT INTO Comptes_reseau_sociaux_et_gaming(id_compte, ${account_attributes}) 
        VALUES(LAST_INSERT_ID(), ${acc_arr});
    `

    let connection

    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [{ insertId }] = await connection.execute(query_1, announce_values)
        await connection.execute(query_2, account_values)
        await connection.commit()
        return res.status(201).json({ insertId })
    } catch (error) {
        connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

const updateSocialAccount = async (req, res, next) => {

    const { id } = req.params
    const [announce, account] = split_announce(req.body, category.accounts)
    delete announce.createdAt
    delete announce.id_annonce
    delete announce.utilisateur
    delete account.id_compte

    if (isEmpty(announce) && isEmpty(account)) {
        return res.status(200).json("everything up-to-date")
    }


    const current_date = getCurrentDate()
    announce.updatedAt = current_date


    let announce_attributes = Object.keys(announce)
    announce_attributes = announce_attributes.map(i => i = "an." + i + " = ?")
    const announce_values = Object.values(announce)

    if (isEmpty(account)) {
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

    let account_attributes = Object.keys(account)
    account_attributes = account_attributes.map(i => i = "c." + i + " = ?")
    const account_values = Object.values(account)

    const attributes = announce_attributes.concat(account_attributes)
    const values = announce_values.concat(account_values)


    const query = `
        UPDATE Annonces an INNER JOIN Comptes_reseau_sociaux_et_gaming c ON an.id_annonce = c.id_compte
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

const deleteSocialAccount = async (req, res, next) => {
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
    getAllSocialAccounts,
    deleteSocialAccount,
    updateSocialAccount,
    addSocialAccount,
    getSingleSocialAccount
}