import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import TransactionHeader from "@/Components/TransactionManage";
import prisma from "@/app/lib/prisma";
import ShowTransaction from "@/Components/ShowTransaction";

export default async function DashboardPage() {
  const session = await getServerSession(authoptions);
  console.log("Session in dashboard:", session);

  const email = session?.user?.email;
  if (!email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userid: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-100 w-full  h-[calc(100vh-56px)] text-black">
      <div className="flex justify-between  mx-40 mt-10 ">
        <h2 className="text-3xl">Transaction</h2>
        <TransactionHeader />
      </div>
      <div className="mx-20 mt-8">
        <ShowTransaction transactions={transactions} />
      </div>
    </div>
  );
}
