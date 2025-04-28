import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TokenProvider } from "@/components/custom/context";
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: [ "300", "200", "100","400", "500", "600", "700"],
  variable: "--font-poppins",
});



export const metadata: Metadata = {
  title: "Soldash",
  description: "Easily find whales for every token on the solana blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable}  antialiased`}
      >
        <TokenProvider>
          {children}
        
        </TokenProvider>
        <Toaster/>
      </body>
    </html>
  );
}
