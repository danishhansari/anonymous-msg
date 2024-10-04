import { users, message } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { username, content } = await request.json();

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Is user is accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, userId: user.id };
    await db.insert(message).values(newMessage);

    return Response.json(
      {
        success: true,
        message: "Message sent",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error occured", error);
    return Response.json(
      {
        success: false,
        message: "Error while sending the messages",
      },
      { status: 500 }
    );
  }
}
