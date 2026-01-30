import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShellWrapper from "./AppShellWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bottom nav / card background for theme and status bar
const themeColor = "#020617";

export const metadata = {
  title: "LLTC Ladder",
  description: "Tennis ladder app",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LLTC Ladder",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
  themeColor,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden overflow-x-hidden bg-background text-text`}
      >
        <AppShellWrapper>{children}</AppShellWrapper>
      </body>
    </html>
  );
}
