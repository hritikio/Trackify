import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";

const getUserId = async () => {
  const session = await getServerSession(authoptions);
  console.log(session);
  if(session){
    //@ts-ignore
    return session.user?.id ?? null;
  }
  return null;
};

//fetch all transactions from the database and return them as a json response
export async function GET() {
  const userId = await getUserId();
  console.log("user id is ", userId);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userid: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log(body);

  const transaction = await prisma.transaction.create({
    data: {
      amount: body.amount,
      type: body.type,
      category: body.category,
      description: body.description || null,
      userid: userId,
    },
  });

  return NextResponse.json({ transaction });
}

export async function DELETE(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: { id: string } = await req.json();
  console.log("body is ", body);

  const result = await prisma.transaction.deleteMany({
    where: {
      id: body.id,
      userid: userId,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    message: `Transaction of id ${body.id} deleted succesfully  `,
  });
}

export async function PUT(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log("update body is ", body);
  const result = await prisma.transaction.updateMany({
    where: {
      id: body.id,
      userid: userId,
    },
    data: {
      amount: body.amount,
      type: body.type,
      category: body.category,
      description: body.description,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Transaction updated" });
}
