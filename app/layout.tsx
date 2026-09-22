import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SchemaCraft AI — Zero-Backend 3NF Relational Schema Architect & Mock API Sandbox",
  description:
    "Autonomous deterministic schema synthesis engine generating PostgreSQL DDL, Prisma schemas, TypeScript interfaces, and in-memory mock REST APIs from natural language domain prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-[#f3f4f6] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
