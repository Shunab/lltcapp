import "./globals.css";
import AppShellWrapper from "./AppShellWrapper";

/* Theme: club primary #3A2E68, dark UI */
const themeColor = "#0c0a14";

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="font-sans antialiased h-full overflow-hidden overflow-x-hidden bg-background text-text">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='tennisLadderTheme';var v=localStorage.getItem(k)||'dark';var ok=['dark','light','dark-warm','light-cool'];if(ok.indexOf(v)===-1)v='dark';document.documentElement.setAttribute('data-theme',v);})();`,
          }}
        />
        <AppShellWrapper>{children}</AppShellWrapper>
      </body>
    </html>
  );
}
