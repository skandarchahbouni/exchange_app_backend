const groupe_response = (arr) => {
    const grouped_response = []
    arr.forEach(obj => {
        const ind = grouped_response.findIndex((o) => o.id_annonce === obj.id_annonce)
        if (ind === -1) {
            delete obj.id_photo
            delete obj.annonce
            obj.photos = [obj.lien_photo]
            delete obj.lien_photo
            grouped_response.push(obj)
        }
        else {
            grouped_response[ind].photos.push(obj.lien_photo)
        }
    })
    return grouped_response
}

module.exports = groupe_response