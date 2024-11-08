const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
   
  const payload = {
    sub: userId,
    exp : expires,
    iat : Math.floor(Date.now() / 1000),
    type
  };
  // const options = {
  //   expiresIn: expires
  // };

  return jwt.sign(payload, secret); // 

};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  
  const expiresIn =Math.floor(Date.now() / 1000) +  config.jwt.accessExpirationMinutes * 60; // Assuming this is in seconds
  const token = generateToken(user._id, expiresIn, tokenTypes.ACCESS);

  // const expires = new Date(Date.now() + expiresIn * 1000); // Expiry date in UTC

  return {
    access: {
      token,
      expires: new Date(expiresIn * 1000) // Format to ISO string
    },
  };

};

module.exports = {
  generateToken,
  generateAuthTokens,
};
