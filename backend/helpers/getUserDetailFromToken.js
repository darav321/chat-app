import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const getUserDetailFromToken = async (token) => {
    if(!token) {
        return {
            message : "seesion out",
            logOut : true
        }
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)

    const user = await User.findById(decode.id)

    return user
}

export default getUserDetailFromToken