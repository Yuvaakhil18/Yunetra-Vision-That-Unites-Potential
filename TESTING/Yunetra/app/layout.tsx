import type { Metadata } from "next";
import { Syne, Space_Mono, Instrument_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import { Toaster } from "react-hot-toast";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Yunetra | Trade Skills, Not Money",
  description: "Skill exchange platform for Indian college students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable} ${instrumentSans.variable}`}>
      <body className="antialiased font-sans selection:bg-primary selection:text-base">
        <div className="noise-overlay pointer-events-none" />
        <div className="gradient-mesh pointer-events-none" />
        <Providers>
          <Navbar />
          <PageWrapper>
            {children}
          </PageWrapper>
        </Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111111',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-syne)',
              borderRadius: '12px',
            },
            success: {
              style: { borderColor: '#38bdf8' },
              iconTheme: { primary: '#38bdf8', secondary: '#111111' },
            },
            error: {
              style: { borderColor: '#f43f5e' },
              iconTheme: { primary: '#f43f5e', secondary: '#111111' },
            }
          }}
        />
      </body>
    </html>
  );
}

