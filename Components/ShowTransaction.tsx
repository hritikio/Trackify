"use client";

import { useEffect, useMemo, useState } from "react";
import TypeBadge from "@/Components/IncomeBadge";
import ActionButtons from "@/Components/ActionButton";
import CategoryFilter from "@/Components/CategoryFilter";
import MonthFilter from "@/Components/MonthFilter";
import TypeFilter from "@/Components/TypeFilter";
import SortFilter from "@/Components/SortFilter";
type Props = {
  transactions: any[];
};

export default function TransactionManage({ transactions }: Props) {
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [monthFilter, setMonthFilter] = useState("This Month");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sortFilter, setSortFilter] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const matchesMonth = (dateValue: string) => {
      const date = new Date(dateValue);
      if (monthFilter === "All Time") return true;
      if (monthFilter === "This Month") {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      }
      return (
        date.getFullYear() === lastMonth.getFullYear() &&
        date.getMonth() === lastMonth.getMonth()
      );
    };

    const matchesType = (typeValue: string) => {
      if (typeFilter === "All Types") return true;
      return typeValue.toLowerCase() === typeFilter.toLowerCase();
    };

    const filtered = transactions.filter((transaction) => {
      const matchesCategory =
        categoryFilter === "All Category" ||
        transaction.category === categoryFilter;

      return (
        matchesCategory &&
        matchesMonth(transaction.date) &&
        matchesType(transaction.type)
      );
    });

    const sorted = filtered.slice().sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return sortFilter === "Oldest First" ? aTime - bTime : bTime - aTime;
    });

    return sorted;
  }, [categoryFilter, monthFilter, sortFilter, transactions, typeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, monthFilter, sortFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredTransactions]);

  const pageItems = useMemo(() => {
    const items: Array<number | string> = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i += 1) items.push(i);
      return items;
    }

    items.push(1);

    if (currentPage > 3) items.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i += 1) items.push(i);

    if (currentPage < totalPages - 2) items.push("...");

    items.push(totalPages);
    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="w-[1200px] mx-auto">
      <div className="mb-4 flex flex-wrap items-center gap-20">
        <MonthFilter value={monthFilter} onChange={setMonthFilter} />
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <TypeFilter value={typeFilter} onChange={setTypeFilter} />
        <SortFilter value={sortFilter} onChange={setSortFilter} />
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Description</th>
            <th className="px-6 py-4 text-left">Amount</th>
            <th className="px-6 py-4 text-left">Type</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {pagedTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-t">
              <td className="px-6 py-4">
                {new Date(transaction.date).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">{transaction.category}</td>

              <td className="px-6 py-4">{transaction.description}</td>

              <td className="px-6 py-4">₹{transaction.amount}</td>

              <td className="px-6 py-4">
                <TypeBadge type={transaction.type} />
              </td>

              <td className="px-6 py-4">
                <ActionButtons transaction={transaction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          className="rounded-md border border-dashed border-blue-400 px-4 py-2 text-sm text-gray-700 cursor-pointer"
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {pageItems.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-gray-500 ">
                ...
              </span>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={`rounded-md border border-dashed border-blue-400 px-4 py-2 text-sm cursor-pointer ${
                isActive
                  ? "bg-teal-500 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          className="rounded-md border border-dashed border-blue-400 px-4 py-2 text-sm text-gray-700 cursor-pointer"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
