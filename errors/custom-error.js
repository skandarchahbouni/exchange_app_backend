class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }

  static badRequest (msg){
    return new CustomAPIError(msg, 400)
  }

  static internal (msg){
    return new CustomAPIError(msg, 500)
  }
}

// const err = new CustomAPIError({message: "ska", statusCode: 400})
// console.log(err.message, err.statusCode)

module.exports = CustomAPIError