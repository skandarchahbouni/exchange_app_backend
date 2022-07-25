const getAllFavourites = async (req, res) => {
    try {
        res.json("getAllFavourites")
    } catch (error) {

    }
}

const removeFromFavourites = async (req, res) => {
    try {
        res.json("removeFromFavourites")
    } catch (error) {

    }
}

const addToFavourites = async (req, res) => {
    try {
        res.json("addToFavourites")
    } catch (error) {

    }
}

module.exports = {
    getAllFavourites,
    removeFromFavourites,
    addToFavourites
}