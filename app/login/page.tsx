"use client";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import { Button, Input } from "@/Components";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Mail } from "lucide-react";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("res is ", res);
    if (res?.ok) {
      router.push("/"); // redirect after login
    } else {
      alert("Invalid credentials");
      setloading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-black flex justify-center items-center">
      <div className="flex">
        {/* LEFT SIDE */}
        <div
          className="h-[600px] w-[480px] bg-white shadow-lg rounded-l-3xl"
        >
          <div className="flex flex-col items-center gap-6 mt-[60px]">
            <h1 className="text-4xl font-bold">Sign in to FinTrack</h1>
            <Image src="/google.svg" alt="Google Logo" width={36} height={36} />
            <p className="text-[#999999]">or use your account</p>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Input
              placeholder="Email"
              image="/mail.svg"
              onChange={(e) => setemail(e.target.value)} // UI only
              name="email"
            />

            <Input
              placeholder="Password"
              isPassword={true}
              image="/lock-keyhole.svg"
              onChange={(e) => setpassword(e.target.value)} // UI only
            />

            <Button Classname="w-[160px] text-white" onClick={()=>{handleLogin(); setloading(true)}} loading={loading}>
              SIGN IN
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-gradient-to-b from-[#4DD0B1] to-[#185A4D] h-[600px] w-[320px] rounded-r-3xl flex flex-col items-center">
          <Image
            src="/Logo2.svg"
            alt="Logo"
            width={100}
            height={100}
            className="translate-y-[32px]"
          />

          <div className="text-white mt-[216px] flex flex-col items-center">
            <p className="font-bold text-4xl">Hello, Friend!</p>
            <p className="mt-[12px]">Enter your personal details and start</p>
            <p>journey with us</p>

            <Button Classname="w-[160px] mt-3" onClick={()=>{router.push("/signup"); setloading(!loading)}}  >SIGN UP</Button>
          </div>
          {/* <div>
            {email}
            <br />
            {password}
          </div> */}
         
        </div>
      </div>
    </div>
  );
}
