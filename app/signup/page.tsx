"use client"
import { use, useState  } from "react";
import Image from "next/image";
import { Button, Input } from "@/Components";
import { redirect,useRouter } from "next/navigation";
const Signup = () => {
  const router=useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [issamePass, setIsSamePass]=useState(true);
  const [loading,setloading]=useState(false);
  


  const handleSubmit=async()=>{

    if(password!==confirmPassword){
      setIsSamePass(false);
      return 
    }
    const res = await fetch("/api/auth/signup",{
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({
        name,email,password
      })
    })

    const data=await res.json();
    console.log("signup data is ");
    console.log(data);
    console.log("res is ", res);

    if(res.ok){
      alert("Signup successful!");
      redirect("/");
    }else{
      alert(data.err?.msg || "Signup Failed")
      setloading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-black border justify-center items-center flex  ">
      <div className="flex ">
        <div className="bg-gradient-to-b from-[#4DD0B1] to-[#185A4D] h-[600px] w-[320px] rounded-l-3xl flex flex-col items-center">
          <Image
            src="/Logo2.svg"
            alt="Logo"
            width={100}
            height={100}
            className="translate-y-[32px]"
          />

          <div className="text-white   mt-[216px] flex flex-col items-center ">
            <p className="font-bold text-4xl">Welcome Back!</p>
            <p className="mt-[12px]">Log in to manage your Finances</p>
            <Button Classname="w-[160px] mt-3 focus:contrast-120 " onClick={()=>router.push("/login")}>
              SIGN IN
            </Button>
          </div>
        </div>
        <div className=" h-[600px] w-[480px]  bg-white shadow-lg rounded-r-3xl">
          <div className="flex flex-col items-center gap-6 mt-[60px]">
            <h1 className="text-4xl font-bold">Create Account</h1>
            <Image src="/google.svg" alt="Google Logo" width={36} height={36} />
            <p className="text-[#999999]">or use your gmail for registration</p>
          </div>
          <div className="flex flex-col items-center gap-4   mt-8  ">
            <Input
              placeholder="Name"
              image="/user.svg"
              name="name"
              onChange={(e) => setName(e.target.value)}
              
            />
            <Input
              placeholder="Email"
              image="/mail.svg"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              isPassword={true}
              image="/lock-keyhole.svg"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              isPassword={true}
              image="/lock-keyhole.svg"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              Classname="w-[160px]  text-white focus:contrast-150 "
              onClick={()=>{handleSubmit(); setloading(true)}}
              loading={loading}
            >
              SIGN UP
            </Button>
            {!issamePass && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
