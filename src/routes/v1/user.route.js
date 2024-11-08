const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
// const authController = require('../../controllers/auth.controller');  // Or the right path
const auth = require("../../middlewares/auth");

const router = express.Router();

// Define the user registration route
//router.post('/register',  validate(userValidation.register), authController.registerUser);  // Ensure the route and controller function are correct

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement a route definition for `/v1/users/:userId`
router.get("/:userId", auth, validate(userValidation.getUser), userController.getUser);

router.put(
  "/:userId",
  auth,
  validate(userValidation.setAddress),
  userController.setAddress
);

module.exports = router;
