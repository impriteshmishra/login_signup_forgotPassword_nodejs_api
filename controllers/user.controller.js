import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // providing user to test api 
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
        }

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

// forgot password

export const forgotPassword = async (req,res)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({
                message:"Please provide email."
            })
        }
        const checkUser = await User.findOne({email});
        if(!checkUser){
            return res.status(400).json({
                message:"User not found."
            })
        }
        const token = jwt.sign({ email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
          });
      
          const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
              user: process.env.MY_GMAIL,
              pass: process.env.MY_PASSWORD,
            },
          });
      
          const receiver = {
            from: "priteshmishra2025@gmail.com",
            to: email,
            subject: "Password Reset Request",
            text: `Click on this link to generate your new password ${process.env.CLIENT_URL}/reset-password/${token}`,
          };
      
          await transporter.sendMail(receiver);
      
          return res.status(200).json({
            message: "Password reset link send successfully on your gmail account",
          });
        } catch (error) {
          return res.status(500).json({ message: "Something went wrong" });
        }
    }  

  
    export const resetPassword = async (req, res) => {
      try {
        const { token } = req.params;
        const { password } = req.body;
    
        if (!password) {
          return res.status(400).json({ message: "Please provide a password." });
        }
    

        let decoded;
        try {
          decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
          return res.status(400).json({ message: "Invalid or expired token." });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
    

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();
    
        return res.status(200).json({ message: "Password reset successfully." });
      } catch (error) {
        console.error("Error in resetPassword:", error.message);
        return res.status(500).json({ message: "Something went wrong." });
      }
    };
    