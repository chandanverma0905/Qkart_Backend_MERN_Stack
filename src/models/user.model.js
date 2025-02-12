const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Email is Invalid"]
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },

    walletMoney: {
      type: Number,
      required: true,
      default: config.default_wallet_money
    },
    
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);


/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({email:email});
  return user;
};

// userSchema.pre('save', function (next) {
//     const salt = bcrypt.genSaltSync();
//     this.password = bcrypt.hashSync(this.password, salt);
//   next();
// })

userSchema.methods.isPasswordMatch = async function (password){
  return bcrypt.compare(password, this.password);
}


userSchema.methods.hasSetNonDefaultAddress = async function(){
  return this.address !== config.default_address;
}


const User = mongoose.model('User', userSchema);


module.exports = {
  User: User
};
