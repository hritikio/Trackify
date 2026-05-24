"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Toast from "@/Components/Toast";

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTransactionModal({
  isOpen,
  onClose,
}: AddTransactionModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          type,
          amount: Number(amount),
          date,
        }),
      });

      if (!response.ok) {
        const error = await response.json();

        console.log("STATUS:", response.status);
        console.log("ERROR:", error);
        setErrorToast(true);

        setTimeout(() => {
          setErrorToast(false);
          onClose()
        }, 3000);

        // throw new Error(error.error || "Failed to create transaction");
      }
      setSuccessToast(true);

      setTitle("");
      setDescription("");
      setCategory("");
      setType("");
      setAmount("");

      setTimeout(() => {
        setSuccessToast(false);
        onClose(); //means setopen(false)
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Add Transaction
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            required
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Description"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            required
          >
            <option value="" disabled>
              Select Category
            </option>

            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            required
          >
            <option value="" disabled>
              Select Type
            </option>

            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Amount"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-500"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-teal-500 px-8 py-2 text-teal-600 transition hover:bg-teal-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-teal-500 px-8 py-2 text-white transition hover:bg-teal-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      {successToast && (
        <Toast type="success" message="Transaction added successfully!" />
      )}

      {errorToast && (
        <Toast
          type="error"
          message="Failed to add transaction. Please try again."
        />
      )}
    </div>
  );
}
