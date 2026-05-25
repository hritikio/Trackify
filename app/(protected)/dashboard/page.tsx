import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import StatCard from "@/Components/StatCardInfo";
import DashboardCharts from "@/Components/DashboardCharts";
import RecentTransactions from "@/Components/RecentTransactions";
import prisma from "@/app/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authoptions);
  console.log("Session in dashboard:", session);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    select: { id: true },
  });

  const transactions = user
    ? await prisma.transaction.findMany({
        where: { userid: user.id },
        orderBy: { date: "desc" },
        select: {
          id: true,
          amount: true,
          type: true,
          category: true,
          title: true,
          date: true,
          createdAt: true,
        },
      })
    : [];

  const chartTransactions = transactions.map((transaction) => ({
    ...transaction,
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
  }));

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="bg-gray-100 w-full h-[calc(100vh-56px)] text-black">
      <div>
        <StatCard />
        <DashboardCharts transactions={chartTransactions} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
