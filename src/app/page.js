import Hero from "@/components/ui/Hero";
import Categories from "@/components/ui/Categories";
import WhyChooseUs from "@/components/ui/WhyChooseUs";
import OrderProcess from "@/components/ui/OrderProcess";
import Products from "@/components/ui/Products";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <WhyChooseUs />
      <Products />
      <OrderProcess />
    </>
  );
}