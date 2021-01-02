import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import { getConfig } from '../config/global_config'
import { handleError } from '../helpers/error'

const jwt = jsonwebtoken
const getKey = keyPath => fs.readFileSync(keyPath, 'utf-8')

export const generateToken = async payload => {
  let privateKey = getKey(getConfig('/privateKey'))
  const verifyOptions = {
    algorithm: 'RS256',
    expiresIn: '24h',
  }
  const token = await jwt.sign(payload, privateKey, verifyOptions)
  return token
}

export const getToken = headers => {
  if (
    headers &&
    headers.authorization &&
    headers.authorization.includes('Bearer')
  ) {
    const parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      return parted[1]
    }
  }
  return undefined
}

export const verifyToken = async (req, res, next) => {
  const publicKey = fs.readFileSync(getConfig('/publicKey'), 'utf8')
  const verifyOptions = {
    algorithm: 'RS256',
  }

  const token = getToken(req.headers)
  if (!token) {
    return handleError({ statusCode: 401, message: 'Token is not valid!' })
  }
  let decodedToken
  try {
    decodedToken = await jwt.verify(token, publicKey, verifyOptions)
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return handleError({ statusCode: 401, message: 'Access token expired!' })
    }
    return handleError({ statusCode: 401, message: 'Token is not valid!' })
  }
  const userId = decodedToken.sub
  req.userId = userId
  next()
}
