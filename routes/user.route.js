import express from "express";
import { forgotPassword, login, register, resetPassword } from "../controllers/user.controller.js";


const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);


export default router;