import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import ReportsAnalytics from "@/Components/ReportsAnalytics";

export default async function ReportsPage() {
  const session = await getServerSession(authoptions);

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
          amount: true,
          type: true,
          category: true,
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

  return (
    <div className="w-full text-black">
      <ReportsAnalytics transactions={chartTransactions} />
    </div>
  );
}
