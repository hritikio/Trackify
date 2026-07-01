import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import {
  transactionInputSchema,
  transactionUpdateSchema,
} from "../../lib/transaction-schema";

const getUserId = async () => {
  const session = await getServerSession(authoptions);
  const email = session?.user?.email;
  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
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
  try {
    const userId = await getUserId();
    console.log("user id is ", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const parsed = transactionInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message || "Invalid transaction payload",
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    console.log("body is " + body);

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        description: data.description || null,
        userid: userId,
        title: data.title,
        date: data.date,
      },
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
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

  const parsed = transactionUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid transaction payload",
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const result = await prisma.transaction.updateMany({
    where: {
      id: data.id,
      userid: userId,
    },
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description || null,
      title: data.title,
      date: data.date,
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
