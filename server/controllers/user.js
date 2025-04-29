import User from "../models/usermodel.js"
import bcryptjs from "bcryptjs"
import crypto from 'crypto'
import generateTokenandcookie from "../utils/generateTokenandcookie.js"
import transporter from "../config/nodemailer.js";



export const signup =  async (req,res)=>{

  const Validatepassword = (password)=>{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^*?])[A-Za-z\d!@#$%^&*?]{8,}$/.test(password)
  }

  const Validateemail = (email)=>{
    return /^[a-zA-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  }

    const {email,password,name} = req.body 
     
    try {
  
       if(!email || !password || !name) {
       return res.status(400).json({success:false,message:"All Fields are Required"})
       }
      
       //checking if user already exists 
      const userAlreadyExists = await User.findOne({email})

      if (userAlreadyExists){
       return res.status(400).json({sucess:false,message:"user already Exists"})
      }
      
      if(!Validateemail(email)){
         return res.status(400).json({success:false,message:"Please enter a valid email address (e.g., example@domain.com)"})
      }

     
      if(!Validatepassword(password)){
        return res.status(400).json({success:false,message:"Password must be at least 8 characters and include a number, a lowercase letter, an uppercase letter, and a symbol."})
      }
      
      
      const hassedPassword = await bcryptjs.hash(password,10)
      const verificationOtp = Math.floor(10000 + Math.random()*900000).toString()

      const user = new User({
        email,
        name,
        password:hassedPassword,
        verificationOtp,
        verificationOtpExpiresAt:Date.now() + 24 * 60 * 60 *1000 // 24 hours
      })

      await user.save();

      generateTokenandcookie(res,user._id)

      const mailOptions = {
        from:process.env.SENDER_EMAIL ,
        to:email,
        subject:'Otp Verification',
        html:`
          <div style="font-family: sans-serif; text-align: center;">
            <h1>Otp Verification </h1>
            <p style="font-size:14px ">Here is the Otp to Sign Up </p>
            <p style="font-size:20px ;">${verificationOtp}</p>
          </div>

        `
      
      }
    
      await transporter.sendMail(mailOptions)
      
     
      res.status(201).json(
        {
            success:true,
            message:"User is Created",
            user:{
                ...user._doc,
                password:undefined
            }
        }

      )
  
    
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
    

}

export const login = async (req,res)=>{
    
  const {email,password} = req.body 

   try {
     
    if(!email || !password ) {
     return res.status(400).json({success:false,message:"Email and Password are Required"})
    }

    const user = await User.findOne({email})
    
    if(!user){
     return  res.status(400).json({success:false,message:"Invalid Email"})
    }
    
    const isMatch = await bcryptjs.compare(password,user.password)

    if(!isMatch) {
      return res.status(400).json({success:false,message:"Invalid Password"})
    }
  
    generateTokenandcookie(res,user._id)

    user.lastLogin = new Date()

    await user.save()

    
   return res.status(201).json({success:true,message:"Login Successful",
      user:{
        ...user._doc ,
        password:undefined
      }
    })

   } catch (error) {
    res.status(500).json({sucess:false,message:error.message})
   }
    
  
}

export const logout = async (req,res)=>{

  try {

    res.clearCookie('token',
      {
        httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
             sameSite:process.env.NODE_ENV === 'production' ? "none":"lax",
            maxAge:7 * 24 * 60 * 60 * 1000
      }
    )
   return res.status(200).json({success:true,message:"Logged Out"})
    
  } catch (error) {
    res.status(500).json({sucess:false,message:error.message})
  }
}


export const verifyEmail = async (req,res)=>{
      const {code} = req.body

       try {

        const user = await User.findOne({verificationOtp:code,
          verificationOtpExpiresAt:{$gt : Date.now()}
        })

        if(!user) {
            return res.status(400).json({success:false,message:"Invalid or expired verification code"})
        }

        if(user.verificationOtpExpiresAt < Date.now()){
          return res.status(400).json({success:false,message:"Expired Otp"})
        }

       user.verificationOtp=undefined,
       user.verificationOtpExpiresAt=undefined,
       user.isVerified=true

       await user.save()

       res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });

       } catch (error) {
        res.status(500).json({sucess:false,message:error.message})
       }
     

}


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User is Not Found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt =Date.now() + 1 * 60 * 60 *1000 //  hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Compose email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: `
         <div style="font-family: sans-serif; text-align: center;">
      <h1 style="margin-bottom: 20px; font-weight: bold;">Hello ${user.name}</h1>
      <p style="margin-bottom: 10px; font-size: 16px;">You requested to reset your password.</p>
      <p style="margin-bottom: 10px; font-size: 16px;">Click the link below to reset it:</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" 
         style="display: inline-block; background-color: #0e3547; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
      <p style="font-size: 14px; margin-top: 20px;">This link will expire in 1 hour.</p>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    


    return res
      .status(200)
      .json({ success: true, message: "Password reset email sent." });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const resetPassword = async (req,res) =>{
   
   const Validatepassword = (password)=>{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*?])[A-Za-z\d!@#$%&*?]{8,}$/.test(password)
   }

   try {

    const {token} = req.params ; 
   const {password} =req.body 

    const user = await User.findOne(
      {
        resetPasswordToken:token,
    }
  )

  if(!user){
    return res.status(400).json({success:false,message:"Invalid Token or Token Expires Try agin "})
  }

  if(!Validatepassword(password)){
     return res.status(400).json({success:false,message:"Password must be at least 8 characters and include a number, a lowercase letter, an uppercase letter, and a symbol."})
  }

  const hassedpassword = await bcryptjs.hash(password,10)

  user.password = hassedpassword
  user.resetPasswordToken = undefined,
  user.resetPasswordExpiresAt = undefined

  await user.save()
  
  //Email for  resetting password successfull

     const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset successful",
      html: `
        <div style="font-family: sans-serif; ">
           <p> Password reset successful </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({success:true,message:"Password reset successful"})
  
   } catch (error) {
      return res.status(500).json({ success: false, message:error.message});
   }
 }

 export const checkauth = async(req,res)=>{
    
  try {
		const user = await User.findById(req.userId)
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
    
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
 }

