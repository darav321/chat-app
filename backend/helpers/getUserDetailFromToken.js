import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const getUserDetailFromToken = async (token) => {
    try {
        if (!token) {
            console.log("token not received")
            return {
                message: "Session expired",
                logOut: true
            };
        }

        console.log("token received", token)

        // ✅ Wrap jwt.verify in try-catch to prevent crashes
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // ✅ Fetch user from database
        const user = await User.findById(decoded._id);

        if (!user) {
            return {
                message: "User not found",
                logOut: true
            };
        }

        return user;

    } catch (error) {
        console.error("Error verifying token:", error);

        // ✅ Handle expired/invalid token properly
        return {
            message: "Invalid or expired token",
            logOut: true
        };
    }
};

export default getUserDetailFromToken;
