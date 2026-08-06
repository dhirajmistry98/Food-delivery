import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';
import  validator  from "validator"

//login user
const loginUser = async(req,res) => {
  const {email, password} = req.body;
     try {
         if (!email?.trim() || !password) {
            return res.json({success:false,message:"Please enter both email and password."})
         }

         const normalizedEmail = email.trim().toLowerCase();
         const user = await userModel.findOne({email: normalizedEmail});
         if (!user) {
            return res.json({success:false,message:"No account found with this email address."})
         }

        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
          return res.json({success:false, message:"Incorrect password. Please try again."})
        }
        const token = createToken(user._id);
        res.json({success:true,token})
     } catch (error) {
        console.log(error);
        res.json({success:false, message:"Unable to sign you in right now. Please try again."})
     }
}
 const createToken = (id) => {
  return jwt.sign({id},process.env.JWT_SECRET)
 }

//register user

const registerUser = async(req,res) => {
     const {name,password,email} = req.body;
     try {
      if (!name?.trim()) {
        return res.json({success:false,message: "Please enter your name"})
      }

      if (!email?.trim() || !password) {
        return res.json({success:false,message: "Please enter your email and password"})
      }

      const normalizedEmail = email.trim().toLowerCase();

      // checking is user already exists
       const exists = await userModel.findOne({email: normalizedEmail})
       if (exists) {
          return res.json({success:false,message: "An account with this email already exists"})
       }
        // validating email format & strong password
        if (!validator.isEmail(normalizedEmail)) {
          return res.json({success:false,message: "Please enter a valid email"})
        }
      if (password.length<8) {
        return res.json({success:false, message:"Password must be at least 8 characters long"})
      }

      //hashing user password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt);

      const newUser = new userModel({
        name:name.trim(),
        email:normalizedEmail,
        password:hashedPassword
      })
     const user = await newUser.save()
     const token = createToken(user._id)
    res.json({success:true,token})
     } catch (error) {
       console.log(error);
       res.json({success:false, message: "Unable to create your account right now. Please try again."})
     }
}


export {loginUser,registerUser}
