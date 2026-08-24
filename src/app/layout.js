import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "Shree Shyam Fast Food | Kitchen & Direct Ordering",
  description: "Fresh, hot & delicious momos, chaap, rolls, chowmein & fast food.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable} data-scroll-behavior="smooth">
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
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