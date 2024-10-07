import { getServerSession, User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/db";
import { message } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user || !user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const response = await db
      .delete(message)
      .where(eq(message.id, Number(messageId)))
      .returning();
    return Response.json({ success: true, message: response });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error while deleting the message",
      },
      { status: 401 }
    );
  }
}
