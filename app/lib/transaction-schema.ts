import { z } from "zod";

export const transactionTypes = ["Income", "Expense"] as const;

export const expenseCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
] as const;

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Refund",
] as const;

const transactionBaseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  amount: z.coerce.number().int("Amount must be a whole number"),
  date: z.coerce.date(),
});

const expenseTransactionSchema = transactionBaseSchema.extend({
  type: z.literal("Expense"),
  category: z.enum(expenseCategories),
});

const incomeTransactionSchema = transactionBaseSchema.extend({
  type: z.literal("Income"),
  category: z.enum(incomeCategories),
});

export const transactionInputSchema = z.discriminatedUnion("type", [
  expenseTransactionSchema,
  incomeTransactionSchema,
]);

export const transactionUpdateSchema = transactionInputSchema.and(
  z.object({ id: z.string().min(1, "Transaction id is required") }),
);

export const getCategoriesForType = (type: string) => {
  if (type === "Income") {
    return incomeCategories;
  }

  if (type === "Expense") {
    return expenseCategories;
  }

  return [] as const;
};
