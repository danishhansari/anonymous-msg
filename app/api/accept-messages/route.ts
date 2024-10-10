import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { users } from "@/db/schema";
import { db } from "@/db";
import { User } from "next-auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "User is not Authenticated " },
      { status: 401 }
    );
  }

  const userId = user.id;
  const { acceptMessages } = await request.json();

  console.log(acceptMessages);
  try {
    const updatedUser = await db
      .update(users)
      .set({ isAcceptingMessage: acceptMessages })
      .where(eq(users.id, Number(userId)));

    if (!updatedUser) {
      return Response.json(
        {
          status: false,
          message: "Failed to update user session to accept messages",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        status: true,
        message: "Message acceptance status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user session to accept messages");
    return Response.json(
      {
        status: false,
        message: "Failed to update user session to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Attempt to get the user session
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // Check if the session or user exists
  if (!session || !user) {
    return Response.json(
      { success: false, message: "User is not authenticated" },
      { status: 401 }
    );
  }

  const userId = Number(user.id);

  console.log("I am userId", userId);
  try {
    // Fetch the user from the database
    const foundUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // If the user is not found, return a 404 error
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return a server error response
    console.error("Error while finding user:", error);
    return Response.json(
      { success: false, message: "Error while finding user" },
      { status: 500 }
    );
  }
}
