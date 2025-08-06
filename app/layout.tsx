if (process.env.NODE_ENV === "production") {
    //Désactiver les logs en production
    for (const methos of ["log", "warn", "error", "info", "debug"]) {
        // @ts-ignore
        console[methos] = () => {};
    }
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom-comps/Footer";
import AppInitializer from "@/components/AppInitializer";
import ErrorToast from "@/components/ErrorToast";
import ToastNotification from "@/components/ToastNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orientys",
  description: "Orientys web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppInitializer />
        {children}
        <Footer />
        <ErrorToast />
        <ToastNotification />
      </body>
    </html>
  );
}
