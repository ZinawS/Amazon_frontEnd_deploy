import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./productCard";
import classes from "./product.module";
import baseUrl from "../../Api/EndPoints";
import Loader from "../Loader/Loader";

function Product() {
  const [products, setProducts] = useState([]); // Renamed from setProduct to setProducts for clarity
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}`);
        setProducts(response.data);
        // console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className={classes.products_container}>
      {loading ? (
        <Loader />
      ) : (
        products.map((p) => <ProductCard key={p.id} product={p} />)
      )}
    </section>
  );
}

export default Product;
