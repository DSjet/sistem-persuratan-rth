import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SIMAPER RTH",
  description: "Sistem Manajemen Persuratan Desa Rambah Tengah Hilir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Navbar />
        {children}
        <script src="../../node_modules/flowbite/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}
