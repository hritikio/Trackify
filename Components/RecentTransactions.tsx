import Link from "next/link";

const formatAmount = (amount: number, type: string) => {
  const isIncome = type.toLowerCase() === "income";
  const sign = isIncome ? "+" : "-";
  return `${sign} ₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);

type TransactionSummary = {
  id: string;
  title: string;
  category: string;
  date: Date;
  amount: number;
  type: string;
};

type Props = {
  transactions: TransactionSummary[];
};

export default function RecentTransactions({ transactions }: Props) {
  return (
    <section className="mx-36 mt-8 rounded-2xl bg-white p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Recent Transactions
          </h3>
          <p className="text-xs text-gray-400">Last 5 transactions</p>
        </div>
        <Link
          href="/transaction"
          className="text-sm text-blue-600 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Transaction</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => {
                const isIncome = transaction.type.toLowerCase() === "income";
                return (
                  <tr key={transaction.id} className="border-t">
                    <td className="px-4 py-3 text-gray-700">
                      {transaction.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {transaction.category}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        isIncome ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {formatAmount(transaction.amount, transaction.type)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
