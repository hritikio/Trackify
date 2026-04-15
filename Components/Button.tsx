"use client"

type ButtonProps = {
  children: React.ReactNode;
  Classname:string;
  onclick?: (e: React.MouseEvent<HTMLButtonElement>) => any;
  
};

const Button = ({ children,Classname="" ,onclick}: ButtonProps) => {
  
  
    return (
      <button className={`h-10 bg-[#00B894] rounded-md ${Classname}`} onClick={onclick}>
        {children}
      </button>
    );
}

export default Button