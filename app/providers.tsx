// /app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: React.PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}





