import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nike Pegasus 43 | Black/White-Volt",
  description: "Nike Pegasus 43 running shoe in Black/White-Volt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-neutral-950">
        {children}
      </body>
    </html>
  );
}
