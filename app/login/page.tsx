import React from "react";
import Image from "next/image";
import { Button, Input } from "@/Components";
import { Mail } from "lucide-react";

const Signup = () => {
  return (
    <div className="bg-white min-h-screen text-black border justify-center items-center flex  ">
      <div className="flex ">
        <div className=" h-[600px] w-[480px]  bg-white shadow-lg rounded-r-3xl">
          <div className="flex flex-col items-center gap-6 mt-[60px]">
            <h1 className="text-4xl font-bold">Create Account</h1>
            <Image src="/google.svg" alt="Google Logo" width={36} height={36} />
            <p className="text-[#999999]">or use your gmail for registration</p>
          </div>
          <div className="flex flex-col items-center gap-4   mt-8  ">
            <Input placeholder="Email" image="/mail.svg" />
            <Input
              placeholder="Password"
              isPassword={true}
              image="/lock-keyhole.svg"
            />
            <Button Classname="w-[160px]  text-white ">SIGN IN</Button>
            
          </div>
        </div>
        <div className="bg-gradient-to-b from-[#4DD0B1] to-[#185A4D] h-[600px] w-[320px] rounded-r-3xl flex flex-col items-center">
          <Image
            src="/Logo2.svg"
            alt="Logo"
            width={100}
            height={100}
            className="translate-y-[32px]"
          />

          <div className="text-white   mt-[216px] flex flex-col items-center ">
            <p className="font-bold text-4xl">Hello, Friend!</p>
            <p className="mt-[12px]">Enter your personal details and start </p>
            <p>journey with us </p>
            <Button Classname="w-[160px] mt-3">SIGN UP</Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
