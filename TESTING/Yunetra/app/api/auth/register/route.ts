import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, college, year, branch } = body;

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            college,
            year,
            branch,
        });

        await newUser.save();

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: { id: newUser._id, email: newUser.email, name: newUser.name }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: 'Validation error: ' + error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
