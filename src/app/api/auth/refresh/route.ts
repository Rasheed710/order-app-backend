import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../../../../lib/prisma';


export async function POST(req: Request) {
  try {
    const { token } = await req.json(); // refresh token from client

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    // Verify refresh token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }

    // Find user and match refresh token
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== token) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh token error:', err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
