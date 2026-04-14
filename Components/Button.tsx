"use client"

type ButtonProps = {
  children: React.ReactNode;
  Classname:string
  
};

const Button = ({ children,Classname="" }: ButtonProps) => {
  
  
    return (
      <button className={`h-10 bg-[#00B894] rounded-md ${Classname}`}>
        {children}
      </button>
    );
}

export default Button