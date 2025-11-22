import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "Server configuration error (JWT_SECRET missing)" },
        { status: 500 }
      );
    }
    
    await connectDB();

    const { email, password } = await request.json();

    // Validates input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Finds user. MUST explicitly select '+password'
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials: User not found" },
        { status: 401 }
      );
    }

    // Checks password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials: Password mismatch" },
        { status: 401 } 
      );
    }

    // Generates JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      secret,
      { expiresIn: "1h" }
    );

    // Serializes the cookie and places JWT token in it
    const serialized = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    // Creates success response and sets the cookie
    const response = NextResponse.json(
      { message: "logged in successfully" },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", serialized);

    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}