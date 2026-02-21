import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-heading-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-body-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "I Have Something To Ask You...",
  description: "Something important. Just click.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} ${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
