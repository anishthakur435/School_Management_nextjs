import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/sections/navbar";
import { Sidenav } from "@/components/sections/sidebar";
import AuthProvider from "./utils/AuthProvider";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Delux School Project ",
  description:
    "Role based  School management project with Nextjs, Tailwind, MUI",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col ">
        <AuthProvider>
          <CssBaseline />
          <div className="flex min-h-screen ">
            <Sidenav />
            <div className="flex-1 flex flex-col ">
              <Navbar />
              <main className="flex-1 ">{children}</main>
            </div>
          </div>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
