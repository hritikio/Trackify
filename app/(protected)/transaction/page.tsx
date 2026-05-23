import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import TransactionHeader from "@/Components/TransactionManage";

export default async function DashboardPage() {
  const session = await getServerSession(authoptions);
  console.log("Session in dashboard:", session);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="bg-gray-100 w-full  h-[calc(100vh-56px)] text-black">
      <div className="flex justify-between  mx-20 mt-10 ">
        <h2 className="text-3xl">Transaction</h2>
        <TransactionHeader />
      </div>
    </div>
  );
}
