"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transaction", label: "Transaction" },
  { href: "/reports", label: "Reports" },
];

export default function ProtectedNav() {
  const pathname = usePathname();

  return (
    <div className="flex text-[#64748B] gap-16">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "inline-flex pb-1 border-b-2 transition-colors " +
              (isActive
                ? "border-[#00B894 ] text-[#00B894]"
                : "border-transparent hover:text-black")
            }
            aria-current={isActive ? "page" : undefined}
          >
            <h3>{item.label}</h3>
          </Link>
        );
      })}
    </div>
  );
}
