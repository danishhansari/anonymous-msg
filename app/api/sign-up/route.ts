import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await db.query.users.findFirst({
      where: and(eq(users.username, username), eq(users.isVerified, false)),
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db
          .update(users)
          .set({
            password: hashedPassword,
            verifyCode,
            verifyExpiry: new Date(Date.now() + 3600000),
          })
          .where(eq(users.id, existingUserByEmail.id))
          .returning();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
      });

      // Send verification email

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
    }
    return Response.json(
      {
        success: true,
        message: "User registered. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrating user", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      { status: 500 }
    );
  }
}
