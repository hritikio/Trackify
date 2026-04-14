"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image, { StaticImageData } from "next/image";

type InputProps = {
  image: string | StaticImageData;
  placeholder?: string;
  isPassword?: boolean;
};

const Input = ({ image, placeholder, isPassword = false }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center w-[320px]   rounded-md px-3 h-12 border border-gray-400 ">
      {/* LEFT ICON */}
      <Image src={image} alt="icon" width={18} height={18}  />

      {/* INPUT */}
      <input
        type={isPassword && !showPassword ? "password" : "text"}
        placeholder={placeholder}
        className="flex-1 px-2 outline-none text-md "
      />

      {/* RIGHT EYE ICON (only for password) */}
      {isPassword && (
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={18} color="#999999" /> : <Eye size={18} color="#999999" />}
        </button>
      )}
    </div>
  );
};

export default Input;
