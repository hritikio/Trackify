"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
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

type RangeKey =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "this_year"
  | "all_time";

type RangeOption = {
  key: RangeKey;
  label: string;
};

const RANGE_OPTIONS: RangeOption[] = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "last_3_months", label: "Last 3 Months" },
  { key: "this_year", label: "This Year" },
  { key: "all_time", label: "All Time" },
];

const PIE_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#22c55e",
  "#ef4444",
  "#8b5cf6",
  "#2dd4bf",
];
const BAR_COLORS = PIE_COLORS;

const toDate = (value?: string | Date | null) => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};

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

const getRangeBounds = (key: RangeKey) => {
  if (key === "all_time") {
    return null;
  }

  const now = new Date();
  const startOfThisMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  if (key === "this_month") {
    return {
      start: startOfThisMonth,
      end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
    };
  }

  if (key === "last_month") {
    return {
      start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)),
      end: startOfThisMonth,
    };
  }

  if (key === "this_year") {
    return {
      start: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)),
      end: new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1)),
    };
  }

  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1)),
    end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
  };
};

export default function ReportsAnalytics({ transactions }: Props) {
  const [rangeKey, setRangeKey] = useState<RangeKey>("this_year");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set<string>();
    transactions.forEach((transaction) => {
      if (transaction.category) unique.add(transaction.category);
    });
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const range = getRangeBounds(rangeKey);

    return transactions.filter((transaction) => {
      if (categoryFilter !== "all" && transaction.category !== categoryFilter) {
        return false;
      }

      if (!range) return true;

      const date = toDate(transaction.date) ?? toDate(transaction.createdAt);
      if (!date) return false;

      return date >= range.start && date < range.end;
    });
  }, [transactions, rangeKey, categoryFilter]);

  const lineData = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return [];
    }

    const monthStartDates = filteredTransactions
      .map(
        (transaction) =>
          toDate(transaction.date) ?? toDate(transaction.createdAt),
      )
      .filter(Boolean)
      .map((date) => getMonthStartUtc(date as Date));

    if (monthStartDates.length === 0) {
      return [];
    }

    const minMonth = new Date(
      Math.min(...monthStartDates.map((date) => date.getTime())),
    );
    const maxMonth = new Date(
      Math.max(...monthStartDates.map((date) => date.getTime())),
    );

    const showYear = minMonth.getFullYear() !== maxMonth.getFullYear();
    const buckets = new Map<
      string,
      { label: string; income: number; expense: number }
    >();

    const cursor = new Date(minMonth);
    while (cursor <= maxMonth) {
      buckets.set(getMonthKey(cursor), {
        label: formatMonthLabel(cursor, showYear),
        income: 0,
        expense: 0,
      });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    filteredTransactions.forEach((transaction) => {
      const date = toDate(transaction.date) ?? toDate(transaction.createdAt);
      if (!date) return;

      const key = getMonthKey(date);
      const bucket = buckets.get(key);
      if (!bucket) return;

      if (transaction.type.toLowerCase() === "income") {
        bucket.income += transaction.amount;
      } else {
        bucket.expense += transaction.amount;
      }
    });

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [filteredTransactions]);

  const expenseByCategory = useMemo(() => {
    const totals = new Map<string, number>();

    filteredTransactions.forEach((transaction) => {
      if (transaction.type.toLowerCase() !== "expense") return;

      const category = transaction.category || "Other";
      totals.set(category, (totals.get(category) ?? 0) + transaction.amount);
    });

    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const barData = expenseByCategory.slice(0, 5);
  const pieData = expenseByCategory.slice(0, 5);

  return (
    <section className="mx-36 mt-8 mb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Reports / Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Insights from your transactions
          </p>
        </div>
        {/* <button
          type="button"
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          Export
        </button> */}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <select
          value={rangeKey}
          onChange={(event) => setRangeKey(event.target.value as RangeKey)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      <h2 className="mt-6 text-base font-semibold text-gray-800">
        Financial Overview
      </h2>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
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
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Spending by Category
            </h3>
            <span className="text-xs text-gray-400">Top categories</span>
          </div>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrencyValue(value)} />
                <Legend iconType="none" />
                <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-row gap-6 mb-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Top 5 Expenses
            </h3>
            <span className="text-xs text-gray-400">By category</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={90}
                    paddingAngle={0}
                    labelLine={false}
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.6;
                      const safeMidAngle =
                        typeof midAngle === "number" ? midAngle : 0;
                      const angle = (-safeMidAngle * Math.PI) / 180;
                      const x = cx + radius * Math.cos(angle);
                      const y = cy + radius * Math.sin(angle);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#ffffff"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ fontSize: "12px" }}
                        >
                          {(percent ? percent * 100 : 0).toFixed(1)}%
                        </text>
                      );
                    }}
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

        <div className="rounded-2xl bg-white p-6 shadow-sm flex-1">
          <h3 className="text-base font-semibold text-gray-800">Summary</h3>
          <p className="text-xs text-gray-400">
            Totals for the selected period
          </p>

          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Total transactions</span>
              <span className="font-medium text-gray-700">
                {filteredTransactions.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total income</span>
              <span className="font-medium text-emerald-600">
                {formatCurrencyValue(
                  filteredTransactions
                    .filter(
                      (transaction) =>
                        transaction.type.toLowerCase() === "income",
                    )
                    .reduce(
                      (total, transaction) => total + transaction.amount,
                      0,
                    ),
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total expenses</span>
              <span className="font-medium text-rose-500">
                {formatCurrencyValue(
                  filteredTransactions
                    .filter(
                      (transaction) =>
                        transaction.type.toLowerCase() === "expense",
                    )
                    .reduce(
                      (total, transaction) => total + transaction.amount,
                      0,
                    ),
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
