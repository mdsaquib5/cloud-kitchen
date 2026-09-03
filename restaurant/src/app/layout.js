import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./layout.css";
import "./globals.css";
import "./responsive.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

const montserrat = Montserrat({
  variable: "--montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://shreeshyaamfastfood.com'),
  title: "Shree Shyaam Fast Food | Order Online",
  description: "Fresh, hot & delicious momos, chaap, rolls, chowmein & fast food. Order online directly from Shree Shyaam Fast Food in Uttam Nagar, New Delhi.",
  keywords: ["fast food", "momos", "chaap", "rolls", "order online", "Shree Shyaam", "Uttam Nagar fast food", "Delhi"],
  openGraph: {
    title: 'Shree Shyaam Fast Food',
    description: 'Fresh, hot & delicious fast food in Uttam Nagar. Order online now!',
    url: 'https://shreeshyaamfastfood.com',
    siteName: 'Shree Shyaam Fast Food',
    images: [
      {
        url: '/logo-brand.webp',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shree Shyaam Fast Food',
    description: 'Fresh, hot & delicious fast food in Uttam Nagar. Order online now!',
    images: ['/logo-brand.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable} data-scroll-behavior="smooth">
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              border: "1px solid #f1f5f9",
              color: "#3b2014", 
              boxShadow: "0 12px 30px -10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              padding: "14px 20px",
              fontSize: "14.5px",
              fontWeight: "600",
              fontFamily: "var(--montserrat), sans-serif",
            },
            className: "premium-toast"
          }}
          icons={{
            success: <FaCheckCircle size={22} color="#3b2014" />,
            error: <FaExclamationCircle size={22} color="#f01543" />
          }}
        />
      </body>
    </html>
  );
}