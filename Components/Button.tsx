"use client";

type ButtonProps = {
  children: React.ReactNode;
  Classname?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;

};

const Button = ({
  children,
  Classname = "",
  onClick,
  loading = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      
      className={`h-10 bg-[#00B894] rounded-md px-4 text-white transition 
        ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
        ${Classname}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
