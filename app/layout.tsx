if (process.env.NODE_ENV === "production") {
    //Désactiver les logs en production
    for (const methos of ["log", "warn", "error", "info", "debug"]) {
        // @ts-ignore
        console[methos] = () => {};
    }
}

import {DataProviders} from './providers';
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Orientys Admin",
    description: "Orientys web app admin dashboard",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <DataProviders>
                {children}
            </DataProviders>
        </ThemeProvider>
        </body>
        </html>
    );
}