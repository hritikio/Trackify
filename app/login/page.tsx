"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSession } from "next-auth/react";



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const { data: session,status } = useSession();




  const handleLogin = async () => {
    const res=await signIn("credentials", {
      email,
      password,
      redirect: false,
     
    });
    console.log("res is", res);

     if (!res?.ok) {
       setError(res?.error || "Login failed");
       return;
     }

     // manual redirect
     window.location.href = "/";



  };
  
  return (
    <div className="p-6 max-w-md mx-auto bg-blue-500">
      <h1 className="text-xl mb-4">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-3"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-gray-800 text-white px-4 py-2 w-full rounded "
      >
        Login
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
