const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");

/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const register = catchAsync(async (req, res) => {

  const { email } = req.body;

  // Check if the user already exists
  // const existingUser = await userService.getUserByEmail(email);
  // if (existingUser) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Email already in use.");
  // }


  // create a new user
  const user = await userService.createUser(req.body); // Call the userService to create a new user

  const tokens = await tokenService.generateAuthTokens(user); // Generate auth tokens for the user

  res.status(httpStatus.CREATED).send({ user, tokens}); // Send back response with user and tokens

});



/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const login = catchAsync(async (req, res, next) => {
 
  try{

  const { email, password } = req.body; // Extract email and password from request body

  //call authService to verify the email and password
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // Generate authentication tokens
  const tokens = await tokenService.generateAuthTokens(user);

  // Send response with user details and tokens
  res.status(httpStatus.OK).send({ user, tokens});
  }
  catch(error){
  next(error);
  }

});

module.exports = {
  register,
  login
};
