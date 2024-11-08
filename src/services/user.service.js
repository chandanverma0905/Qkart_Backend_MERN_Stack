// const { User } = require("../models");
// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");
// const bcrypt = require("bcryptjs");

// // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
// /**
//  * Get User by id
//  * - Fetch user object from Mongo using the "_id" field and return user object
//  * @param {String} id
//  * @returns {Promise<User>}
//  */

//  const getUserById = async (id)=>
//  {
//      const theUser = await User.findOne({ "_id": id });
//      // console.log(theUser,"theUser")
//      return theUser;
//  }



// // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
// /**
//  * Get user by email
//  * - Fetch user object from Mongo using the "email" field and return user object
//  * @param {string} email
//  * @returns {Promise<User>}
//  */

//  const getUserByEmail=async(email)=>{
//     const result=await User.findOne({"email":email});
//     // if(!result){
//     //   throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//     // }
//     return result; // Return null if the user is not found
// }


// // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
// /**
//  * Create a user
//  *  - check if the user with the email already exists using `User.isEmailTaken()` method
//  *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
//  *    1. “200 OK status code using `http-status` library
//  *    2. An error message, “Email already taken”
//  *  - Otherwise, create and return a new User object
//  *
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  * @throws {ApiError}
//  * 
//  * 
//  * userBody example:
//  * {
//  *  "name": "crio-users",
//  *  "email": "crio-user@gmail.com",
//  *  "password": "usersPasswordHashed"
//  * }
//  *
//  * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
//  */

//  const createUser=async(userBody)=>{
 
//     /*
//     1. Either isEmailTaken will resturn "result" meaning true, and if condition will run, or false(ie undefined)
//     2. The ApiError class defined in src/utils/ApiError.js lets you respond back to the client with an error response as shown below
//         {
//             "code": 400,  
//             "message": "\"\"userId\"\" must be a valid mongo id",  
//             "stack": "Optionally shown if there’s a error stack trace"  
//         }
//     */
//       if (await User.isEmailTaken(userBody.email)) {
//           throw new ApiError(httpStatus.OK, "Email already taken");
//         }
    
//         if (!userBody.name) {
//           throw new ApiError(httpStatus.BAD_REQUEST, "Name field is required");
//         }
//         if (!userBody.email) {
//           throw new ApiError(httpStatus.BAD_REQUEST, "Email is not allowed to be empty");
//         }
        
//       if(!userBody.password){
//        throw new ApiError(httpStatus.BAD_REQUEST,"Password field is required");
//       }
      
//       const requiredFields = ['name', 'email', 'password'];
//       for (const field of requiredFields) {
//         if (!userBody[field]) {
//           throw new ApiError(httpStatus.BAD_REQUEST, `${field.charAt(0).toUpperCase() + field.slice(1)} field is required`);
//         }
//       }
    
//     // Create the user without hashing the password here
//     const user = await User.create(userBody);
//     return user;
//     }
    
  
 
// // TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
// /**
//  * Get subset of user's data by id
//  * - Should fetch from Mongo only the email and address fields for the user apart from the id
//  *
//  * @param {ObjectId} id
//  * @returns {Promise<User>}
//  */
// // const getUserAddressById = async (id) => {

// //   // const userAddress = await User.findById(id).select('address'); // Fetch only address
// //   const userAddress = await User.findOne({_id:id},{email:1,address:1});
// //   return userAddress;

// // };

// async function getUserAddressById(id, q) {
//   const user = await User.findOne({ _id: id }, { address: 1, email: 1 });
//   if (q) {
//       return { address: user.address }
//   }

//   return { _id: id, address: user.address, email: user.email };
// }

// /**
//  * Set user's shipping address
//  * @param {String} email
//  * @returns {String}
//  */
// // const setAddress = async (user, newAddress) => {
 
// //  // Check if newAddress is provided and is a non-empty string
// // //  if (!newAddress || typeof newAddress !== 'string') {
// // //   throw new APIError("Address must be a non-empty string", 400); // Use your defined error class
// // // }

// // // Check the length of the address
// // // if (newAddress.length > 20) { // Adjust the length condition as needed (20 or 30)
// // //   throw new APIError("Address must be at least 20 characters long", 400); // Use your defined error class
// // // }

// // user.address = newAddress; // Set the new address
// // await user.save(); // Save the updated user

// // return user.address; // Return the updated address
// // };


// async function setAddress(userId, address) {
//   if (!address) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Address field is required!");
//   }
//   if (address.length < 20) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Address shouldn't be less than 20 characters");
//   }
//   const user = await User.findById(userId);
//   user.address = address;

//   return user.address;
// }



// module.exports = {
//   getUserById,
//   getUserByEmail,
//   createUser,
//   getUserAddressById,
//   setAddress
// };



// ----------------------------


const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const { generateAuthTokens } = require('./token.service')


/**
 * Get User by id
 * @param {String} id
 * @returns {Promise<User>}
 */

const  getUserById = async(id)=> {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found")
    }
    return user;
}


/**
 * Get user by email

 * @param {string} email
 * @returns {Promise<User>}
 */

 const getUserByEmail = async(email) => {
    const theUser = await User.findOne({ email });
    // console.log("theUserByMailId",theUser)
    return theUser;
}
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 */


//  const createUser = async(data) => {
//     const user =await User.isEmailTaken(data.email)
//         // // return res.send(httpStatus.NOT_ACCEPTABLE).json({message: "Email already taken"});
//         if(user)
//         {
//             throw new ApiError(httpStatus.CONFLICT, "Email already taken");
//         }
//         const newUser =await User.create(data)
//         return newUser;
  
    
// }

 const createUser = async(data) => {
    if(await User.isEmailTaken(data.email)){
        // // return res.send(httpStatus.NOT_ACCEPTABLE).json({message: "Email already taken"});
        throw new ApiError(httpStatus.OK, "Email already taken");
    }
    if(!data.email){
        throw new ApiError(httpStatus.BAD_REQUEST, "Email is not allowed to be empty");
    }
    if(!data.name){
        throw new ApiError(httpStatus.BAD_REQUEST, "Name field is required");
    }
    if(!data.password){
        throw new ApiError(httpStatus.BAD_REQUEST, "Password field is required");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = await User.create({...data, password: hashedPassword});
    // return {_id:user._id,email:user.email,name:user.name,walletMoney:parseInt(user.walletMoney)};  
    return user
}



// TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserAddressById = async (id) => {
    return User.findOne({_id:id},{email:1,address:1})
};

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();

  return user.address;
};


module.exports={getUserById ,getUserByEmail,createUser,getUserAddressById,setAddress}
