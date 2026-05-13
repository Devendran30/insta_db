import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Ensure this file exists in your app folder!

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. UPDATE YOUR PROJECT DETAILS HERE
export const metadata: Metadata = {
  title: "Instagram Manager",
  description: "Manage and display your Instagram feed with a Next.js and MySQL backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-black`}
      >
        {/* 
           If you ever want a constant Header or Navigation bar, 
           you would place it right here above {children}
        */}
        {children}
      </body>
    </html>
  );
}