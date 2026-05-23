// components/TransactionHeader.tsx
"use client";

import { useState } from "react";
import AddTransactionButton from "./AddTransactionButton";
import AddTransactionModal from "./AddTransactionModal";

export default function TransactionHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
   

        <AddTransactionButton  onClick={() => setOpen(true)} />
      <AddTransactionModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
