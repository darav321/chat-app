import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String, 
        required : true,
        unique : true,
    },
    password : {
        type : String, 
        required : true
    },
    profilePic : {
        type : String,
        default : ""
    }
}, {timestamps : true})

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id : this._id,
            name : this.name,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// userSchema.methods.generateRefreshToken = function() {
//     return jwt.sign(
//         {
//             _id : this._id
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn : process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

const User = mongoose.model("User", userSchema)

export default User