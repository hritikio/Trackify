"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

type TransactionInput = {
  amount: number;
  type: string;
  category: string;
  date?: string | Date | null;
  createdAt?: string | Date | null;
};

type Props = {
  transactions: TransactionInput[];
};

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#64748b"];

const formatCurrencyValue = (
  value?: number | string | ReadonlyArray<number | string>,
) => {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const num = typeof item === "number" ? item : Number(item);
        return Number.isNaN(num)
          ? String(item)
          : `₹${num.toLocaleString("en-IN")}`;
      })
      .join(", ");
  }

  const numberValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numberValue)) {
    return String(value);
  }

  return `₹${numberValue.toLocaleString("en-IN")}`;
};

const toDate = (value?: string | Date | null) => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};

const formatMonthLabel = (date: Date, showYear: boolean) =>
  date.toLocaleString("en-US", {
    month: "short",
    year: showYear ? "2-digit" : undefined,
    timeZone: "UTC",
  });

const getMonthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

const getMonthStartUtc = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

export default function DashboardCharts({ transactions }: Props) {
  const lineData = useMemo(() => {
    const datedTransactions = transactions
      .map((transaction) => ({
        ...transaction,
        resolvedDate: toDate(transaction.date) ?? toDate(transaction.createdAt),
      }))
      .filter((transaction) => Boolean(transaction.resolvedDate)) as Array<
      TransactionInput & { resolvedDate: Date }
    >;

    if (datedTransactions.length === 0) {
      return [];
    }

    const monthStartDates = datedTransactions.map((transaction) =>
      getMonthStartUtc(transaction.resolvedDate),
    );

    const minMonth = new Date(
      Math.min(...monthStartDates.map((date) => date.getTime())),
    );
    const maxMonth = new Date(
      Math.max(...monthStartDates.map((date) => date.getTime())),
    );

    const buckets = new Map<
      string,
      { label: string; income: number; expense: number }
    >();
    const showYear = minMonth.getFullYear() !== maxMonth.getFullYear();

    const cursor = new Date(minMonth);
    while (cursor <= maxMonth) {
      const label = formatMonthLabel(cursor, showYear);
      buckets.set(getMonthKey(cursor), { label, income: 0, expense: 0 });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    datedTransactions.forEach((transaction) => {
      const date = toDate(transaction.date) ?? toDate(transaction.createdAt);
      if (!date) return;

      const key = getMonthKey(date);
      const bucket = buckets.get(key);
      if (!bucket) return;
      const type = transaction.type.toLowerCase();

      if (type === "income") {
        bucket.income += transaction.amount;
      } else {
        bucket.expense += transaction.amount;
      }

      buckets.set(key, bucket);
    });

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [transactions]);

  const pieData = useMemo(() => {
    const buckets = new Map<string, number>();

    transactions.forEach((transaction) => {
      if (transaction.type.toLowerCase() !== "expense") return;

      const category = transaction.category || "Other";
      buckets.set(category, (buckets.get(category) ?? 0) + transaction.amount);
    });

    return Array.from(buckets.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  return (
    <section className="mx-36 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Spending Overview
          </h2>
          <p className="text-sm text-gray-500">
            Income vs expense and category split
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Income vs Expense
            </h3>
            <span className="text-xs text-gray-400">Monthly trend</span>
          </div>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrencyValue(value)} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800">
            Expense Breakdown
          </h3>
          <p className="text-xs text-gray-400">All-time spending by category</p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrencyValue(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {pieData.length === 0 ? (
                <p className="text-xs text-gray-400">
                  No expenses in this range.
                </p>
              ) : (
                pieData.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                      <span>{entry.name}</span>
                    </div>
                    <span className="font-medium text-gray-700">
                      ₹{entry.value.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
