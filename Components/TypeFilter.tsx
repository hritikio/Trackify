"use client";

type TypeFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
};

export default function TypeFilter({
  value,
  onChange,
  options = ["All Types", "Income", "Expense"],
}: TypeFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 min-w-[150px] rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none focus:border-teal-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
