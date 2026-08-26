import React, { Suspense } from "react";
import FoodsClient from "./FoodsClient";

async function getMenuData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const [catRes, prodRes] = await Promise.all([
      fetch(`${apiUrl}/menu/categories`, { cache: 'no-store' }),
      fetch(`${apiUrl}/menu/foods`, { cache: 'no-store' })
    ]);

    let categories = { success: false, categories: [] };
    let products = { success: false, foods: [] };

    if (catRes.ok) categories = await catRes.json();
    if (prodRes.ok) products = await prodRes.json();

    return {
      categories: categories.success ? categories.categories : [],
      products: products.success ? products.foods : []
    };
  } catch (error) {
    console.error("Error fetching menu data", error);
    return { categories: [], products: [] };
  }
}

export default async function FoodsPage() {
  const { categories, products } = await getMenuData();

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Loading menu...</div>}>
      <FoodsClient initialCategories={categories} initialProducts={products} />
    </Suspense>
  );
}
