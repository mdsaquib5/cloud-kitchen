import { Montserrat } from "next/font/google";
import "./layout.css";
import "./globals.css";
import "./responsive.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Cloud Kitchen",
  description: "Order food from your favorite restaurants",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}