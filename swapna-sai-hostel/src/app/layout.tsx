import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Girls Hostel in Mangalpally | Swapna Sai Luxury Girls Hostel",
  description: "Affordable and secure girls hostel with WiFi, meals, and 24/7 security, Locker Facility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f0f0f] text-white min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
