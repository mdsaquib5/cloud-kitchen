import SectionTitle from "../layout/SectionTitle";
import ProCard from "../shared/ProCard";

const Products = () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <section className="product-bg">
            <div className="container">
                <SectionTitle
                    title="Popular Food Items"
                    description="Crispy, savory & signature delicacies prepared fresh on every order."
                />

                <div className="products-grid">
                    {items.map((id) => (
                        <ProCard key={id} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;