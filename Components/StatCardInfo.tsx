import StatCard from "@/Components/statCardProps";
import prisma from "@/app/lib/prisma";
import { TrendingUp, TrendingDown } from "lucide-react";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const StatCardInfo = async () => {
  const session = await getServerSession(authoptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user?.id) {
    return null;
  }

  const transaction = await prisma.transaction.findMany({
    where: { userid: user.id },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const currentMonthTransaction = transaction.filter((t) => {
    const date = new Date(t.date ?? t.createdAt);

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  const currentMonthBalance = currentMonthTransaction.reduce(
    (balance, currentTransaction) => {
      return currentTransaction.type.toLowerCase() === "income"
        ? balance + currentTransaction.amount
        : balance - currentTransaction.amount;
    },
    0,
  );

  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  const previousMonthTransaction = transaction.filter((t) => {
    const date = new Date(t.date ?? t.createdAt);

    return (
      date.getMonth() === previousMonth.getMonth() &&
      date.getFullYear() === previousMonth.getFullYear()
    );
  });

  const previousMonthBalance = previousMonthTransaction.reduce(
    (balance, currentTransaction) => {
      return currentTransaction.type.toLowerCase() === "income"
        ? balance + currentTransaction.amount
        : balance - currentTransaction.amount;
    },
    0,
  );

  const balanceChange = currentMonthBalance - previousMonthBalance;

  const CurrentMonthIncome = currentMonthTransaction.reduce(
    (totalIncome, transaction) => {
      return transaction.type.toLowerCase() === "income"
        ? totalIncome + transaction.amount
        : totalIncome;
    },
    0,
  );

  const previousMonthIncome = previousMonthTransaction.reduce(
    (totalIncome, transaction) => {
      return transaction.type.toLowerCase() === "income"
        ? totalIncome + transaction.amount
        : totalIncome;
    },
    0,
  );

  function getPercentageChange(current: number, previous: number) {
    if (previous === 0) return 0;

    return ((current - previous) / previous) * 100;
  }

  const incomeChangePercent = getPercentageChange(
    CurrentMonthIncome,
    previousMonthIncome,
  );
  console.log(`
    current month income is ${CurrentMonthIncome}
    previous month income is ${previousMonthIncome}
    `);

  console.log(
    `The income change percent from last month is ${incomeChangePercent}`,
  );

  const currentMonthExpense = currentMonthTransaction.reduce(
    (totalExpense, transaction) => {
      return transaction.type.toLowerCase() === "expense"
        ? totalExpense + transaction.amount
        : totalExpense;
    },
    0,
  );

  const previousMonthExpense = previousMonthTransaction.reduce(
    (totalExpense, transaction) => {
      return transaction.type.toLowerCase() === "expense"
        ? totalExpense + transaction.amount
        : totalExpense;
    },
    0,
  );

  const expenseChangePercent = getPercentageChange(
    currentMonthExpense,
    previousMonthExpense,
  );

  console.log(`
    current month expense is ${currentMonthExpense}
    previous month expense is ${previousMonthExpense}
    expense change percent is ${expenseChangePercent} 
    `);

  const currentSavingsRate =
    CurrentMonthIncome === 0
      ? 0
      : ((CurrentMonthIncome - currentMonthExpense) / CurrentMonthIncome) * 100;

  const previousSavingsRate =
    previousMonthIncome === 0
      ? 0
      : ((previousMonthIncome - previousMonthExpense) / previousMonthIncome) *
        100;

  const savingsRateChange = currentSavingsRate - previousSavingsRate;

  console.log(`
    current saving rate is ${currentSavingsRate}
    previous saving rate is ${previousSavingsRate}
    saving rate change percent is ${savingsRateChange} 
    `);

  return (
    <div className="flex gap-4 justify-between mx-36   mt-10">
      <div>
        <StatCard
          amount={currentMonthBalance}
          title="Total Balance"
          changeType="amount"
          change={balanceChange}
        />
      </div>
      <div>
        <StatCard
          amount={CurrentMonthIncome}
          title="Total Income"
          changeType="percentage"
          change={Number(incomeChangePercent.toFixed(0))}
        />
      </div>

      <div>
        <StatCard
          amount={currentMonthExpense}
          title="Total expense"
          changeType="percentage"
          change={Number(expenseChangePercent.toFixed(0)) * -1}
        />
      </div>

      <div className="w-65 h-31 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex h-full flex-col justify-between">
          <p className="text-sm text-gray-500">Saving Rate</p>

          <h2 className="text-4xl font-bold text-gray-800">
            {currentSavingsRate.toFixed(0)}%
          </h2>

          <div
            className={`flex items-center gap-2 text-sm ${
              savingsRateChange > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            <span>
              {savingsRateChange.toFixed(2)}{" "}
              {savingsRateChange > 0 ? `improvemnt ` : "from last month "}{" "}
            </span>

            {currentSavingsRate > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCardInfo;
