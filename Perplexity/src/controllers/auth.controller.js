import bcrypt from 'bcryptjs';
import UserModel from '../models/user.model.js';

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

export { register };
