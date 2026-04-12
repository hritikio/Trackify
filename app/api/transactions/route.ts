import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { Transaction } from "@/app/generated/prisma/client";

//fetch all transactions from the database and return them as a json response
export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const transaction = await prisma.transaction.create({
    data: {
      amount: body.amount,
      type: body.type,
      category: body.category,
      description:body.description || null
    },
  });

  return NextResponse.json({transaction})
}


export async function DELETE(req: Request) {
  const body: { id: string} = await req.json()
  console.log("body is ",body)

   await prisma.transaction.delete({
  where:{
    id:body.id
  }
})

  return NextResponse.json({
    message:`Transaction of id ${body.id} deleted succesfully  `
  })
}


export async function UPDATE(req:Request){
  const body = req.json();
  console.log("update body is ",body);
  await prisma.transaction.update({
    where:{
      id:body.id
    },
    data:{
      

    }
  })

}