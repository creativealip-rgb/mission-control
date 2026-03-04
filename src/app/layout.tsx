import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Mission Control - AI-Powered Project Management",
  description: "AI-powered project management with autonomous agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen text-white selection:bg-indigo-500/30">
        <div className="flex flex-col h-screen overflow-hidden bg-black">
          <TopNav />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 overflow-y-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
