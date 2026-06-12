import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import { sendEmail } from '../Services/mail.service.js';
async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(409).json({
                success: false,
                message: `${field} already exists`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });
        const emailVerificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const baseUrl = process.env.APP_URL || 'http://localhost:3000';
        const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${emailVerificationToken}`;

        await sendEmail({
            to: email,
            subject: 'Verify your Perplexity account',
            text: `Hi ${username},\n\nThanks for signing up for Perplexity. Verify your email by visiting:\n\n${verifyUrl}\n\nThis link expires in 24 hours.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
                    <h1 style="font-size: 24px; margin-bottom: 8px;">Welcome, ${username}</h1>
                    <p style="line-height: 1.5; color: #444;">Thanks for registering on Perplexity. Click the button below to verify your email address.</p>
                    <a href="${verifyUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #20808d; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Email</a>
                    <p style="font-size: 13px; color: #666; line-height: 1.5;">If the button does not work, copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #999;">This link expires in 24 hours.</p>
                </div>
            `,
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error: error.message,
        });
    }
}
export async function verifyEmail(req,res){
    const{token}=req.query;
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await UserModel.findOne({email:decoded.email})

    if(!user){
        return res.status(400).json({
            message:"invalid token",
            success: false,
            err:"user not found"
        })
    }
    user.verified=true;
    await user.save()

    const html=`
        <h1>Email verified Sucessfully</h1>
        <p>Your email has been verified. you can now login in to your account.</p>

    `

    res.send(html)
}

async function login(req,res){
    const {email,password}=req.body

    const user = await UserModel.findOne({ email }).select('+password');

    if(!user){
        return res.status(400).json({
            message:"Invalid email or Password",
            success:false,
            err:"user not found"
        })
    }

    const isPasswordMatch=await user.comparePassword(password)

    if(!isPasswordMatch){
        return res.status(400).json({
            message:"invalid email or password",
            success:false,
            err:"incorrect password "
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message:"please verify your email before logging in ",
            sucesss:false,
            err:"email not verified"
        })
    }

    const token =jwt.sign({
        id:user._id,
        username:user.username,

    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token",token)

    res.status(200).json({
        message:"login successful",
        success:"true",
        user:{
            id:user.id,
            username:user.username,
            email:user.email,
        }
    })

}

export async function getMe(req,res){
    const userId=req.user.id
    const user=await UserModel.findById(userId).select("-password")

    if(!user){
        return res.status(404).json({
            message:"user notfound",
            success:false,
            err:"User not found"
        })
    }

    res.status(200).json({
        message:"user details fetched sucessfully",
        success:true,
        user

    })
}


export { register,login };
