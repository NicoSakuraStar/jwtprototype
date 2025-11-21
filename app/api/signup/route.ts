import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// This Route Handler creates a new user and hashes their password before saving.
export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // 1. Basic Input Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    
    await newUser.save();

    // Do not return sensitive user data (like the password hash)
    return NextResponse.json(
      { message: "User registered successfully. You can now log in." },
      { status: 201 } // 201 Created
    );

  } catch (error: any) {
    console.error("Sign-up Error:", error);
    // Handle mongoose validation errors or other server issues
    return NextResponse.json(
      { message: "Internal Server Error during registration" },
      { status: 500 }
    );
  }
}