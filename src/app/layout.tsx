import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // Ensure TailwindCSS or global styles are configured
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social",
  description: "Socail Media Web-App Project",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen">
              <NavBar></NavBar>
              <main className="py-8">
                {/* container to center the content */}
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className="hidden md:block md:col-span-3">
                      <SideBar></SideBar>
                    </div>
                    <div className="md:col-span-9">{children}</div>
                  </div>
                </div>
              </main>
            </div>
            <Toaster></Toaster>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
