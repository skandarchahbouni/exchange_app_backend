const getAllApartments = async (req, res) => {
    try {
        res.json("getAllApartments")
    } catch (error) {
        
    }
}

const getSingleApartment = async (req, res) => {
    try {
        res.json("getSingleApartment")
    } catch (error) {
        
    }
}

const addApartment = async (req, res) => {
    try {
        res.json("addApartment")
    } catch (error) {
        
    }
}

const updateApartment = async (req, res) => {
    try {
        res.json("updateApartment")
    } catch (error) {
        
    }
}

const deleteApartment = async (req, res) => {
    try {
        res.json("deleteApartment")
    } catch (error) {
        
    }
}

module.exports = {
    getAllApartments,
    deleteApartment,
    updateApartment,
    addApartment,
    getSingleApartment
}