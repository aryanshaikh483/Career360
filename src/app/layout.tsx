import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Career360",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="text-color-1100 lg:hidden text-center my-72">
          This website is not displayed on mobile devices.
        </div>
        <div className="content">
          <div className="flex min-h-screen flex-col justify-center items-start px-24 py-10 bg-color-100 space-y-4">

            <div className="w-full rounded-2xl flex space-x-2 justify-center items-center">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
