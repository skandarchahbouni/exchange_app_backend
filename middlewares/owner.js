const db = require("../config/db.config")

const verify = async (req, res, next, table, id_of_table) => {
    try {
        const { id } = req.params
        const { id_utilisateur } = req.user
        let query = `SELECT utilisateur FROM ${table} WHERE ${id_of_table} = ?`
        const [owner] = await db.execute(query, [id])
        if (owner.length === 0) {
            return res.status(404).json("The record that you are asking for doesn't exist.")
        }
        if (owner[0].utilisateur !== id_utilisateur) {
            return res.status(401).json("Unauthorized, this record belongs to another user.")
        }
        return next()
    } catch (error) {
        return next(error)
    }
}

const announce_owner_middleware = async (req, res, next) => {
    try {
        await verify(req, res, next, "Annonces", "id_annonce")
    } catch (error) {
        return next(error)
    }
}

const offer_owner_middleware = async (req, res, next) => {
    try {
        await verify(req, res, next, "Offres", "id_offre")
    } catch (error) {
        next(error)
    }
}

const favourite_owner_middleware = async (req, res, next) => {
    try {
        await verify(req, res, next, "Favories", "id_favorie")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    announce_owner_middleware,
    offer_owner_middleware,
    favourite_owner_middleware,
}