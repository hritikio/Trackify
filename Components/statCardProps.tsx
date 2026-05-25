import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  amount: number;
  change?: number;
  changeType?: "percentage" | "amount";
  amountInPercent?: boolean;
};

const StatCard = ({
  title,
  amount,
  change,
  changeType,
  amountInPercent = false,
}: StatCardProps) => {
  const hasChange = typeof change === "number";
  const isPositive = (change ?? 0) >= 0;

  const changeText = hasChange
    ? changeType === "percentage"
      ? `${change > 0 ? "+" : " "}${change}% from last month`
      : `${change > 0 ? "+" : "-"}₹${Math.abs(change).toLocaleString(
          "en-IN",
        )} this month`
    : "";

  return (
    <div className="w-65 h-31 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-full flex-col justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <h2 className="text-4xl font-bold text-gray-800">
          {!amountInPercent
            ? `₹${amount.toLocaleString("en-IN")}`
            : `${amount}%`}
        </h2>

        {hasChange ? (
          <div
            className={`flex items-center gap-2 text-sm ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            <span>{changeText}</span>

            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;
