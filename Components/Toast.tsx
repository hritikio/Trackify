"use client";

import { CheckCircle, XCircle } from "lucide-react";

type ToastProps = {
  message: string;
  type: "success" | "error";
};

export default function Toast({ message, type }: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 rounded-lg border px-5 py-4 shadow-lg
        ${
          isSuccess
            ? "border-green-300 bg-green-50 text-green-700"
            : "border-red-300 bg-red-50 text-red-700"
        }`}
    >
      {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}

      <p className="font-medium">{message}</p>
    </div>
  );
}
