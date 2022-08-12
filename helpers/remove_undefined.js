const remove_undefined_attributes = (obj) => {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
    return obj
}

module.exports = remove_undefined_attributes
