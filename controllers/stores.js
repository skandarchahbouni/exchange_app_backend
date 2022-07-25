const getAllStores = async (req, res)=>{
    try {
        res.json("getAllStores")
    } catch (error) {
        
    }
}

const getSingleStore = async (req, res)=>{
    try {
        res.json("getSingleStore")
    } catch (error) {
        
    }
}

const create_store = async (req, res) => {
    try {
        res.json("create_store")
    } catch (error) {
        throw error
        // TODO : throw custom error or something 
    }
}

const login_to_store = async (req, res) => {
    try {
        res.json("login_to_store")
    } catch (error) {

    }
}

const updateStoreAccount = async (req, res)=>{
    try {
        res.json("updateStoreAccount")
    } catch (error) {
        
    }
}

const deleteStoreAccount = async (req, res)=>{
    try {
        res.json("deleteStoreAccount")
    } catch (error) {
        
    }
}

module.exports = {
    getAllStores,
    getSingleStore,
    create_store,
    login_to_store,
    updateStoreAccount,
    deleteStoreAccount
}