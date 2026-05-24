type Props = {
  type: string;
};

export default function TypeBadge({ type }: Props) {
  const income = type.toLowerCase() === "income";

  return (
    <span
      className={`rounded-full px-4 py-1 text-sm font-medium
      ${income ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
    >
      {type}
    </span>
  );
}
