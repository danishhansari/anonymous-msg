import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await db.query.users.findFirst({
      where: eq(users.username, decodedUsername),
    });

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }
    const isCodeValid = user.verifyCode === code;
    const codeExpiry = user.verifyExpiry;
    const isCodeNotExpired = codeExpiry != null && codeExpiry > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.id, user.id));

      return Response.json(
        {
          status: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, Please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
