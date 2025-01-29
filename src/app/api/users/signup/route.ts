import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";

connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const reqBody = req.body;
        const { username, email, password } = reqBody;
        
        console.log(reqBody); //remove after testing

        // check if user already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hashing the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Creating the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}