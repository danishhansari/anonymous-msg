import { db } from "@/db";
import { users } from "@/db/schema";
import { z } from "zod";
import { usernameValidation } from "@/validation/signUpValidation";
import { and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          status: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await db.query.users.findFirst({
      where: and(eq(users.username, username), eq(users.isVerified, true)),
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
          existingVerifiedUser,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
        existingVerifiedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while checking username", error);
    return Response.json(
      { success: false, message: "Error while checking username" },
      { status: 500 }
    );
  }
}
