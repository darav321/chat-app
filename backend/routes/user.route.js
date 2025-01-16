import { loginUser, logout, registerUser, searchUser, userDetail, userUpdate } from "../controllers/user.controller.js";
import express from "express"

const router = express.Router()

router.post("/register", registerUser)
router.post('/login', loginUser)
router.get('/userDetail', userDetail)
router.post('/logout', logout)
router.patch('/update', userUpdate)
router.post('/search', searchUser)

export default router