import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster"; // For toast notifications

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Project LEGIT - AI Legal Chat",
  description:
    "An AI-powered legal chat application to help you understand your rights.",
  // Add more metadata as needed: icons, openGraph, etc.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider> {/* AuthProvider wraps ThemeProvider and children */}
          <ThemeProvider>
            {children}
            <Toaster /> {/* For displaying toasts */}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
