"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import Toast from "@/Components/Toast";
import ConfirmDeleteModal from "@/Components/ConfirmDeleteModal";

type Transaction = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  type: string;
  amount: number;
  date: string;
};

type ActionButtonProps = {
  transaction: Transaction;
};

export default function ActionButton({ transaction }: ActionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState(
    "Failed to update transaction.",
  );
  const [deleteSuccessToast, setDeleteSuccessToast] = useState(false);
  const [deleteErrorToast, setDeleteErrorToast] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    setTitle(transaction.title ?? "");
    setDescription(transaction.description ?? "");
    setCategory(transaction.category ?? "");
    setType(transaction.type ?? "");
    setAmount(String(transaction.amount ?? ""));
    setDate(new Date(transaction.date).toISOString().split("T")[0]);
  }, [transaction]);

  const handleDelete = async () => {
    const response = await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: transaction.id }),
    });

    if (!response.ok) {
      console.error("Failed to delete transaction");
      setDeleteErrorToast(true);

      setTimeout(() => {
        setDeleteErrorToast(false);
      }, 3000);
      return;
    }

    setDeleteSuccessToast(true);
    setIsDeleteOpen(false);
    router.refresh();

    setTimeout(() => {
      setDeleteSuccessToast(false);
    }, 1500);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Edit transaction with id:", transaction);

    const originalDate = new Date(transaction.date).toISOString().split("T")[0];
    const noChanges =
      title === (transaction.title ?? "") &&
      description === (transaction.description ?? "") &&
      category === (transaction.category ?? "") &&
      type === (transaction.type ?? "") &&
      Number(amount) === Number(transaction.amount ?? 0) &&
      date === originalDate;

    if (noChanges) {
      setEditErrorMessage("You didn't edit anything.");
      setErrorToast(true);

      setTimeout(() => {
        setErrorToast(false);
      }, 3000);
      return;
    }

    const response = await fetch("/api/transactions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: transaction.id,
        title,
        description,
        category,
        type,
        amount: Number(amount),
        date,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update transaction");
      setEditErrorMessage("Failed to update transaction.");
      setErrorToast(true);

      setTimeout(() => {
        setErrorToast(false);
      }, 3000);
      return;
    }

    setSuccessToast(true);
    setIsOpen(false);
    router.refresh();

    setTimeout(() => {
      setSuccessToast(false);
    }, 1500);
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-yellow-400 p-2"
          aria-label="Edit transaction"
        >
          <Pencil size={14} />
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="rounded-full bg-red-500 p-2 text-white"
          aria-label="Delete transaction"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Edit Transaction
              </h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
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
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-teal-500 px-8 py-2 text-teal-600 transition hover:bg-teal-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-teal-500 px-8 py-2 text-white transition hover:bg-teal-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      {successToast && (
        <Toast type="success" message="Transaction updated successfully!" />
      )}

      {errorToast && <Toast type="error" message={editErrorMessage} />}

      {deleteSuccessToast && (
        <Toast
          type="success"
          message="Deleted transaction successfully!"
        />
      )}

      {deleteErrorToast && (
        <Toast type="error" message="Failed to delete transaction." />
      )}
    </>
  );
}
