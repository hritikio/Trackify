import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { safeParse, z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(3, "Length too short"),
});
type user = z.infer<typeof signupSchema>;

export async function POST(req: Request) {
  const body: user = await req.json();
  console.log(`body is `, body);

  const parse = signupSchema.safeParse(body);
  console.log("parse is", parse);

  if (!parse.success) {
    return Response.json(
      {
        err: parse.error.format(),
      },
      { status: 400 },
    );
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  console.log("existing user is", existingUser);

  if (existingUser) {
    return Response.json(
      {
        err: {
          email: "Email already exists",
        },
      },
     { status: 400 },
    );
  }

  const hashpass = await bcrypt.hash(body.password, 10);
  console.log("hashpass is", hashpass);

  const user = await prisma.user.create({
    data: {
      name: parse.data.name,
      email: parse.data.email,
      password: hashpass,
    },
  });

  return Response.json(
    {
      message: "User created successfully",
      user,
    },
    { status: 201 },
  );
}
