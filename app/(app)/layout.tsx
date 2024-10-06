import Navbar from "@/components/navbar";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Anonymous message",
  description: "Built by one and only Danish",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
