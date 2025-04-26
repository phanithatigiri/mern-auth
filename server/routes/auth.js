import express from 'express'

import { signup ,login,logout,verifyEmail,forgotPassword,resetPassword, checkauth} from '../controllers/user.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/verifyEmail',verifyEmail)
router.post('/forgotPassword',forgotPassword)
router.post('/resetpassword/:token',resetPassword)
router.get('/checkauth',verifyToken,checkauth)

export default router 