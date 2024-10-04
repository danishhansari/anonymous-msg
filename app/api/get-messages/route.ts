import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/db";
import { User } from "next-auth";
import { desc, eq } from "drizzle-orm";
import { message } from "@/db/schema";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User is not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user.id;
  try {
    const messages = await db.query.message.findMany({
      where: eq(message.userId, Number(userId)),
      orderBy: desc(message.createdAt),
    });

    if (!messages || messages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error occured", error);
    return Response.json(
      {
        success: false,
        messages: "Error while getting messages",
      },
      { status: 500 }
    );
  }
}
