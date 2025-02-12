const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
// const bcrypt = require('bcryptjs');
/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {

  const user = await userService.getUserByEmail(email);

  // console.log("User found:", user); // Debugging output

  if (!user) 
  {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  // const isMatch = await bcrypt.compare(password, user.password);

 // Use the isPasswordMatch method from the user model
 const isMatch = await user.isPasswordMatch(password);

 console.log("Password comparison result (isPasswordMatch):", isMatch);

  if (!isMatch) 
  {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  return user;
};


module.exports = {
  loginUserWithEmailAndPassword,
};

