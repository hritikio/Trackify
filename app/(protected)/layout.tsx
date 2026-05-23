import Image from "next/image";
import { CircleUserRound } from "lucide-react";
import ProtectedNav from "@/Components/ProtectedNav";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="w-full h-14 border p-4 bg-white px-16 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex text-black justify-between ">
          <div className="-translate-y-2">
            <Image src="./Logo1.svg" alt="Logo" width={100} height={40} />
          </div>
          <ProtectedNav />
          <div className="flex text-[#64748B]">
            Profile
            <CircleUserRound className="ml-2" color="#64748B" />
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}
