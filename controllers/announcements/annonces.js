const db = require("../../config/db.config")

const count = async (req, res, next) => {
    const { id_utilisateur } = req.user
    const query = `
        SELECT COUNT(*) nb_annonces FROM Annonces
        WHERE utilisateur = ?
        GROUP BY utilisateur
    `
    try {
        const [response, _] = await db.execute(query, [id_utilisateur])
        return res.status(200).json(response[0])
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    count
}