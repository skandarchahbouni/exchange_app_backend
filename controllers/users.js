const getAllUsers = async (req, res) => {
    try {
        res.json("getAllUsers")
    } catch (error) {

    }
}

const getSingleUser = async (req, res) => {
    try {
        res.json("getSingleUser")
    } catch (error) {

    }
}

const signup = async (req, res) => {
    try {
        res.json("user signup")
    } catch (error) {

    }
}

const signin = async (req, res) => {
    try {
        res.json("user sigin in")
    } catch (error) {

    }
}

const updateUser = async (req, res) => {
    try {
        res.json("updateUser")
    } catch (error) {

    }
}

const deleteUser = async (req, res) => {
    try {
        res.json("deleteUser")
    } catch (error) {

    }
}

module.exports = {
    getAllUsers,
    getSingleUser,
    signup,
    signin,
    updateUser,
    deleteUser
}