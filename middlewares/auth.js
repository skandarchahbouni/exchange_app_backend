const jwt = require('jsonwebtoken')
const UnauthenticatedError = require('../errors/unauthenticated')

const authenticationMiddleware = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return next(new UnauthenticatedError('No token provided'))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // const { id_utilisateur, email } = decoded
    req.user = decoded
    next()
  } catch (error) {
    return next(new UnauthenticatedError('Not authorized to access this route'))
  }
}

module.exports = authenticationMiddleware