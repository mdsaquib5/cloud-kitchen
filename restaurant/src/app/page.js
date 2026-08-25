import Hero from "@/components/ui/Hero";
import Categories from "@/components/ui/Categories";
import WhyChooseUs from "@/components/ui/WhyChooseUs";
import Products from "@/components/ui/Products";
import OrderProcess from "@/components/ui/OrderProcess";
import Cta from "@/components/ui/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyChooseUs />
      <Products />
      <OrderProcess />
      <Cta />
    </>
  );
}