"use client";

type CategoryFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
};

export default function CategoryFilter({
  value,
  onChange,
  options = ["All Category", "Food", "Travel", "Shopping", "Entertainment"],
}: CategoryFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 min-w-[180px] rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none focus:border-teal-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
