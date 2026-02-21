import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/lib/WalletContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "World Cup 2026 - Prediction Markets",
  description: "Trade on FIFA World Cup 2026 outcomes powered by Polymarket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
