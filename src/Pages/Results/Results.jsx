import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import baseUrl from "../../Api/EndPoints";
import ProductCard from "../../Components/Product/productCard";
import resultsClasses from "./results.module.css";
import Loader from "../../Components/Loader/Loader";

function Results() {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/category/${categoryName}`);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={resultsClasses.category_header}>
            <h1 className={resultsClasses.category_title}>Results</h1>
            <p className={resultsClasses.category_subtitle}>
              Category: {categoryName}
            </p>
          </div>
          <hr className={resultsClasses.category_divider} />
          <div className={resultsClasses.products_container}>
            {filteredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

export default Results;
