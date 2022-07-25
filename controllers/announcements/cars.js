const getAllCars = async (req, res) => {
    try {
        res.json("getAllCars")
    } catch (error) {
        
    }
}

const getSingleCar = async (req, res) => {
    try {
        res.json("getSingleCar")
    } catch (error) {
        
    }
}

const addCar = async (req, res) => {
    try {
        res.json("addCar")
    } catch (error) {
        
    }
}

const updateCar = async (req, res) => {
    try {
        res.json("updateCar")
    } catch (error) {
        
    }
}

const deleteCar = async (req, res) => {
    try {
        res.json("deleteCar")
    } catch (error) {
        
    }
}

module.exports = {
    getAllCars,
    deleteCar,
    updateCar,
    addCar,
    getSingleCar
}