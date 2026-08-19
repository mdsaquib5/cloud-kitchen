import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./layout.css";
import "./globals.css";
import "./responsive.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import BottomNav from "@/components/layout/BottomNav";

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Your's Kitchen | Authentic Cloud Kitchen & Gourmet Delicacies",
  description: "Order fresh, authentic Mughlai biryanis, tandoori starters, curries, and gourmet food direct from Your's Kitchen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable} data-scroll-behavior="smooth">
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
        <BottomNav />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3500,
          }}
        />
      </body>
    </html>
  );
}