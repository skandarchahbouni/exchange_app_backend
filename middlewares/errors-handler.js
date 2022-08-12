const CustomAPIError = require('../errors/custom-error')
const UnauthenticatedError = require('../errors/unauthenticated')

const errorHandlerMiddleware = (err, req, res, next) => {

    console.log("handling errors")
    if (err instanceof UnauthenticatedError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    if (err instanceof CustomAPIError){
        return res.status(err.statusCode).json({msg: err.message})
    }

    // multer error 
    if (err.code === "LIMIT_UNEXPECTED_FILE"){
        return res.status(400).json("you can't upload more than 3 files at once")
    }

    let custom_err
    switch (err.errno) {
        case 1364:
            custom_err = CustomAPIError.badRequest("missing requigred attribute: " + err.message)
            break;
        case 1062:
            custom_err = CustomAPIError.internal(err.message)
            break;
        case 3819:
            custom_err = CustomAPIError.badRequest(err.message)
            break;
        default:
            console.log(err)
            // return res.status(500).json("Something went wrong")
            return res.status(500).json(err)
    }

    return res.status(custom_err.statusCode).json(custom_err.message)
}

module.exports = errorHandlerMiddleware