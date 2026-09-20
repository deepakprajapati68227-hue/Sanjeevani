import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { RiskProvider } from "@/context/RiskContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sanjeevani — AI-Powered Climate Resilience & Early Warning System",
  description:
    "Autonomous end-to-end climate resilience platform synthesizing live weather telemetry, groundwater depletion trends, and local vulnerability into community alerts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="bg-[#F4F7F8] text-[#17212B] min-h-screen antialiased selection:bg-[#147D78] selection:text-white">
        <RiskProvider>{children}</RiskProvider>
      </body>
    </html>
  );
}
