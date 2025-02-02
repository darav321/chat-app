import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import getUserDetailFromToken from "../helpers/getUserDetailFromToken.js"

// const generateAccessAndRefreshToken = async (userid) => {
//     try {
//         const user = await User.findById(userid)
//         const accessToken = user.generateAccessToken()
//         const refreshToken = user.generateRefreshToken()

//         user.refreshToken = refreshToken
//         await user.save({validateBeforeSave : false})
//         return {accessToken, refreshToken}
//     } catch (error) {
//         return res.status(500).json({message : "Internal server error"})
//     }
// }

export const registerUser = async (req, res) => {
    try {
        const {name, email, password, profilePic} = req.body
        const useremail = await User.findOne({email})
        
        if(useremail === email)
        {
            res.status(400).json({message : "Email already registered"})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPass = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password : hashedPass,
            profilePic
        }

        const user = new User(payload)
        const userSave = await user.save()

        res.header("Access-Control-Allow-Origin", "https://chatmore-1.onrender.com");
        res.header("Access-Control-Allow-Credentials", "true");

        res.status(200).json({message : "User registered Successfully", data : userSave})

    } catch (error) {
        console.log("error while registering user : ", error)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        
        const useremail = await User.findOne({email})

        if(!useremail) {
            return res.status(400).json({message : "User does not exists"})
        }

        const verifyPass = await bcryptjs.compare(password, useremail.password)   
        
        if(!verifyPass) {
            return res.status(400).json({message : "Invalid User credentials"})
        }

        const accessToken = await useremail.generateAccessToken(useremail._id)

        const cookieOptions = {
            httpOnly : true,
            secure : true
        }

        res.status(200).cookie('accessToken', accessToken, cookieOptions).json({message : "Login Successfull", accessToken : accessToken})
    } catch (error) {
        console.log("Error while signing in the user")
        res.status(500).json({message : "Internal Server error"})
    }
}

// export const refreshAccessToken = async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

//     if(!incomingRefreshToken) {
//         return res.status(401).json({message : "Unauthorized request"})
//     }
//     try {
//         const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

//         const user = await User.findById(decodedToken?._id)

//         if(!user) {
//             return res.status(401).json({messgae : "Inavlid refresh token"})
//         }

//         if(incomingRefreshToken !== user.refreshToken) {
//             return res.status(401).josn({message : "Refresh token is invalid or used"})
//         }

//         const options = {
//             httpOnly : true,
//             secure : true
//         }

//         const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

//         res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', newRefreshToken, options).json({message : "Access Token refreshed", accessToken : accessToken, refreshToken : newRefreshToken})
//     } catch (error) {
//         return res.status(500).json({message : "Invalid refresh token"})
//     }
// }

export const userDetail = async (req, res) => {
    try {
        const token = req.cookies.accessToken
<<<<<<< HEAD
=======
        console.log(token)
>>>>>>> b0868aed78dc12d1f25099f74a1432406d553840
        const user = await getUserDetailFromToken(token)

        res.status(200).json({message : "User-details", data : user})
    } catch (error) {
        console.log("Cannot fetch User Details", error)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: "strict",
            expires: new Date(0) // Expires immediately
<<<<<<< HEAD
        })
=======
        });

        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: "strict",
            expires: new Date(0) // Expires immediately
        });
>>>>>>> b0868aed78dc12d1f25099f74a1432406d553840

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error while logging out:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const userUpdate = async (req, res) => {
    try {
        const token = req.cookies.accessToken 
        const user = await getUserDetailFromToken(token)
        
        const {name, profilePic} = req.body

        const updatedUser = await User.updateOne({_id : user._id}, {name, profilePic})

        const userInfo = await User.findById(user._id)

        res.status(200).json({message : "User updated Successfully", userInfo})
    } catch (error) {
        console.log("Error while updating the user")
        res.status(500).json({message : "Internal server error"})
    }
}

export const searchUser = async (req,res) => {
    try {
        const {search} = req.body
    
        const query = new RegExp(search, "i", "g")
    
        const user = await User.find({
            "$or" : [
                {name : query},
            ]
        }).select("-password")
    
        return res.status(200).json({
            message : 'All users',
            data : user,
            success : true
        })
    } catch (error) {
        console.log("error while search users")
        res.status(500).json({message : "Internal Server Error"})
    }
}
