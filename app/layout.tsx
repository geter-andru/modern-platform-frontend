import type { Metadata } from "next";
import { Geist, Geist_Mono, Red_Hat_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../src/shared/design-system/global-styles.css";
import { Providers } from "./providers";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "@/app/lib/auth";
import { SessionWarningBanner } from "./components/auth/SessionWarningBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Primary fonts for the design system
const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Andru Revenue Intelligence",
  description: "Stop guessing who your buyers are. AI-powered ICP analysis for B2B SaaS founders in under 3 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${redHatDisplay.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <AuthProvider>
            <Providers>
              <SessionWarningBanner position="top" />
              {children}
            </Providers>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
