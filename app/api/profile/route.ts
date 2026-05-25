import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

const getUser = async () => {
  const session = await getServerSession(authoptions);
  const email = session?.user?.email;
  if (!email) {
    return null;
  }

  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });
};

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userid: user.id },
    orderBy: { date: "desc" },
  });

  const payload = {
    user,
    transactions,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=trackify-export.json",
    },
  });
}

export async function PATCH(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updates: { name?: string; password?: string } = {};

  if (typeof body.name === "string" && body.name.trim().length > 0) {
    updates.name = body.name.trim();
  }

  if (typeof body.password === "string" && body.password.length >= 3) {
    updates.password = await bcrypt.hash(body.password, 10);
  }

  if (!updates.name && !updates.password) {
    return NextResponse.json(
      { error: "Provide a valid name or password." },
      { status: 400 },
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updates,
    select: { name: true },
  });

  return NextResponse.json({ success: true, user: updatedUser });
}

export async function DELETE() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.transaction.deleteMany({
    where: { userid: user.id },
  });

  return NextResponse.json({ deleted: result.count });
}
