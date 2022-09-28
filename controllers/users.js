const db = require('../config/db.config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const getCurrentDate = require('../helpers/get_current_date')
const Utilisateur = require('../models/utilisateur')
const remove_undefined_attributes = require('../helpers/remove_undefined')
const CustomAPIError = require('../errors/custom-error')


const getAllUsers = async (req, res, next) => {
    const query = "SELECT * FROM Utilisateurs"
    try {
        const [users] = await db.execute(query)
        return res.status(200).json(users)
    } catch (error) {
        return next(error)
    }
}

const getSingleUser = async (req, res, next) => {
    const { id } = req.params
    const query = `SELECT * FROM Utilisateurs WHERE id_utilisateur = ?`

    try {
        const [user] = await db.execute(query, [id])
        if (user.length === 0) {
            return res.status(400).json("user not found")
        }
        return res.status(200).json(user)
    } catch (error) {
        return next(error)
    }
}



const signup = async (req, res, next) => {
    try {
        const saltRounds = 10

        let user = new Utilisateur(req.body) // filter the req.body 
        if (!user.mot_de_passe) return next(CustomAPIError.badRequest("missing required attribute: mot_de_passe"))

        user = remove_undefined_attributes(user)
        delete user.id_utilisateur // bcz it's auto increment 

        const current_date = getCurrentDate()
        user.createdAt = current_date
        user.updatedAt = current_date


        let attributes = Object.keys(user)
        let values = Object.values(user)

        const arr = new Array(attributes.length).fill('?')

        const ind = attributes.findIndex((elem) => elem === "mot_de_passe")
        // replace the plainTextPassword by the hashed one

        let plain_password = values[ind]
        let hashed_password
        try {
            hashed_password = await bcrypt.hash(plain_password, saltRounds)
        } catch (error) {
            throw CustomAPIError.internal("something went wrong")
        }

        values[ind] = hashed_password


        const query = `
            INSERT INTO Utilisateurs (${attributes}) VALUES(${arr})
        `
        const [{ insertId }] = await db.execute(query, values)
        const current_user = req.body
        current_user.id_utilisateur = insertId
        delete current_user.mot_de_passe

        // the jwt  
        const token = jwt.sign(current_user, process.env.JWT_SECRET, {
            expiresIn: '5d',
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT !== "development",
            maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json(current_user)
    } catch (error) {
        if (error.errno === 1062) {
            return next(CustomAPIError.badRequest("Email addresse already in use."))
        }
        return next(error)
    }
}

const signin = async (req, res, next) => {

    const query = `
        SELECT * FROM Utilisateurs WHERE email = ?
    `

    try {
        const { email, mot_de_passe } = req.body

        if (!email) return next(CustomAPIError.badRequest("missing required attribute : email"))
        if (!mot_de_passe) return next(CustomAPIError.badRequest("missing required attribute : mot_de_passe"))

        const [user] = await db.execute(query, [email])
        if (user.length === 0) {
            // user not found 
            return next(CustomAPIError.badRequest("user doesn't exist"))
        }
        else if (user.length === 1) {
            let current_user = user[0]
            let match
            try {
                match = await bcrypt.compare(mot_de_passe, current_user.mot_de_passe)
            } catch (error) {
                throw error
            }
            if (!match) {
                // password mismatch
                return next(CustomAPIError.badRequest("wrong credentials"))
            }
            delete current_user.mot_de_passe

            const token = jwt.sign(current_user, process.env.JWT_SECRET, {
                expiresIn: '5d',
            })
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 5 * 24 * 60 * 60 * 1000,
                secure: process.env.ENVIRONMENT !== "development",
            });
            return res.status(200).json(current_user)
        }
        else return res.status(400).json("fatal")
    } catch (error) {
        return next(error)
    }
}

const updateUser = async (req, res, next) => {

    const { id_utilisateur } = req.user
    let user = new Utilisateur(req.body)
    user = remove_undefined_attributes(user)
    delete user.createdAt
    delete user.id_utilisateur

    let attributes = Object.keys(user)
    let values = Object.values(user)

    attributes.updatedAt = getCurrentDate()

    const columns = attributes.map(i => i += " = ?")

    const query = `
        UPDATE Utilisateurs 
        SET ${columns}
        WHERE id_utilisateur = ${id_utilisateur}
    `

    try {
        await db.execute(query, values)
        return res.status(200).json("everything-up-to-date")
    } catch (error) {
        return next(error)
    }
}

const deleteUser = async (req, res) => {
    const { id_utilisateur } = req.user

    const query = "DELETE FROM Utilisateurs WHERE id_utilisateur = ?"
    try {
        await db.execute(query, [id_utilisateur])
        return res.status(200).json("deleted succesfully")
    } catch (error) {
        // throw error 
    }
}

const logout = async (req, res, next) => {
    try {
        res.cookie('token', {
            expires: Date.now(),
            httpOnly: true,
        })
        return res.status(200).json("logout succesfully")
    } catch (error) {
        return next(error)
    }
}

const uploadProfilePicture = async (req, res, next) => {

    const { file } = req
    if (!file) return next(CustomAPIError.badRequest('No image provided'))

    const { filename } = file
    const { id_utilisateur } = req.user

    const query = `
        UPDATE Utilisateurs
        SET photo = ? 
        WHERE id_utilisateur = ?
    `
    try {
        await db.execute(query, [filename, id_utilisateur])
        return res.status(200).json("profile picture uploaded succesfully")
    } catch (error) {
        return next(error)
    }
}

const getProfile = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const query = `
        SELECT * FROM Utilisateurs Where id_utilisateur = ?
    `
    try {
        const [user, _] = await db.execute(query, [id_utilisateur])
        if (user.length === 0){
            return res.status(404).json("user not found")
        }
        return res.status(200).json(user[0])
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllUsers,
    getSingleUser,
    getProfile,
    signup,
    signin,
    updateUser,
    uploadProfilePicture,
    deleteUser,
    logout
}