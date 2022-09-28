const getCurrentDate = ()=>{
    const current_date =  new Date().toJSON().slice(0, 19).replace('T', ' ')
    return String(current_date)
}

module.exports = getCurrentDate