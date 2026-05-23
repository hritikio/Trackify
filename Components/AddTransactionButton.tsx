"use client";

import { Button } from "@/Components";

type AddTransactionButtonProps = {
  onClick: () => void;
};

export default function AddTransactionButton({
  onClick,
}: AddTransactionButtonProps) {
  return (
    <Button Classname="w-[180px]" onClick={onClick}>
      + Add Transaction
    </Button>
  );
}
