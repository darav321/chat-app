import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const getUserDetailFromToken = async (token) => {
    if(!token) {
        return {
            message : "seesion out",
            logOut : true
        }
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decode._id)

    return user
}

export default getUserDetailFromToken