const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const { User } = require("../models");
// TODO: CRIO_TASK_MODULE_AUTH - Set mechanism to retrieve Jwt token from user request
/**
 * These config options are required
 * Option 1: jwt secret environment variable set in ".env"
 * Option 2: mechanism to fetch jwt token from request Authentication header with the "bearer" auth scheme
 */
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Fetches token from the "Authorization" header with "Bearer <token>"
};

// TODO: CRIO_TASK_MODULE_AUTH - Implement verify callback for passport strategy to find the user whose token is passed
/**
 * Logic to find the user matching the token passed
 * - If payload type isn't `tokenTypes.ACCESS` return an Error() with message, "Invalid token type" in the callback function
 * - Find user object matching the decoded jwt token
 * - If there's a valid user, return the user in the callback function
 * - If user not found, return `false` in the user field in the callback function
 * - If the function errs, return the error in the callback function
 *
 * @param payload - the payload the token was generated with
 * @param done - callback function
 */
const jwtVerify = async (payload, done) => {

  try {
    // Check if the token is of type "ACCESS"
    if (payload.type !== tokenTypes.ACCESS) {
      return done(new Error("Invalid token type"), false);
    }

    // Find the user associated with the token's payload ID
    const user = await User.findById(payload.sub);
    
    if (!user) {
      return done(null, false); // No user found, return `false`
    }

    return done(null, user); // User found, return the user object
  } catch (error) {
    return done(error, false); // If error occurred, return the error
  }

};

// TODO: CRIO_TASK_MODULE_AUTH - Uncomment below lines of code once the "jwtVerify" and "jwtOptions" are implemented
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify); // Register the strategy with Passport using the name "jwt"


module.exports = {
  jwtStrategy,
};
