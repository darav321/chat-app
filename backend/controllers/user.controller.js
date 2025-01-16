import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import getUserDetailFromToken from "../helpers/getUserDetailFromToken.js"

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
            res.status(400).json({message : "User does not exists"})
        }

        const verifyPass = await bcryptjs.compare(password, useremail.password)   
        
        if(!verifyPass) {
            res.status(400).json({message : "Invalid User credentials"})
        }

        const tokenData = {
            id : useremail._id,
            email : useremail.email
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn : '1d'})

        const cookieOptions = {
            http : true,
            secure : true
        }

        res.status(200).cookie('token', token, cookieOptions).json({message : "Login Successfull", token : token})
    } catch (error) {
        console.log("Error while signing in the user")
        res.status(500).json({message : "Internal Server error"})
    }
}

export const userDetail = async (req, res) => {
    try {
        const token = req.cookies.token

        const user = await getUserDetailFromToken(token)

        res.status(200).json({message : "User-details", data : user})
    } catch (error) {
        console.log("Cannot fetch User Details", error)
        res.status(500).json({message : "Internal Server Error"})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: "strict",
            expires: new Date(0) // Expires immediately
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error while logging out", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const userUpdate = async (req, res) => {
    try {
        const token = req.cookies.token 
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