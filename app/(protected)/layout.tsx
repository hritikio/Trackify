import Image from "next/image";
import { CircleUserRound } from "lucide-react";
import ProtectedNav from "@/Components/ProtectedNav";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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

      <main className="flex-1">{children}</main>

      <footer className="mt-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-gray-500 h-[64px] flex justify-between px-44 items-center">
        <div>© 2025 FinTrack. All rights reserved.</div>
        {/* <div className="ml-auto">Made with ❤️ by FinTrack Team</div> */}
        <div className="flex gap-8">
          <p>Privacy Policy</p>
          <p>Terms of Use</p>
          <p>Contact</p>
        </div>
      </footer>
    </div>
  );
}
