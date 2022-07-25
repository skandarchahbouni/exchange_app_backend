const getAllPhones = async (req, res) => {
    try {
        res.json("getAllPhones")
    } catch (error) {
        
    }
}

const getSinglePhone = async (req, res) => {
    try {
        res.json("getSinglePhone")
    } catch (error) {
        
    }
}

const addPhone = async (req, res) => {
    try {
        res.json("addPhone")
    } catch (error) {
        
    }
}

const updatePhone = async (req, res) => {
    try {
        res.json("updatePhone")
    } catch (error) {
        
    }
}

const deletePhone = async (req, res) => {
    try {
        res.json("deletePhone")
    } catch (error) {
        
    }
}

module.exports = {
    getAllPhones,
    deletePhone,
    updatePhone,
    addPhone,
    getSinglePhone
}