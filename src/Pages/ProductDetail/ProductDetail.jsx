import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Layout from "../../Components/Layout/Layout";
import axios from "axios";
import baseUrl from "../../Api/EndPoints";
import classes from "./productdetail.module.css";
import Loader from "../../Components/Loader/Loader";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { Type } from "../../Utility/actionType";
import { DataContext } from "../../DataProvider/DataProvider";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, dispatch] = useContext(DataContext);

  const addToCart = () => {
    if (!product) return;

    dispatch({
      type: Type.ADD_TO_CART,
      item: {
        id: product.id,
        image: product.image,
        title: product.title,
        price: product.price,
        rating: product.rating,
        description: product.description,
      },
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${baseUrl}/${productId}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className={classes.error}>{error}</div>
      </Layout>
    );
  if (!product)
    return (
      <Layout>
        <div>Product not found</div>
      </Layout>
    );

  return (
    <Layout>
      <div className={classes.product_detail_container}>
        <div className={classes.product_main}>
          {/* Image Gallery */}
          <div className={classes.image_gallery}>
            <div className={classes.main_image}>
              <img
                src={product.image}
                alt={product.title || "Product"}
                aria-label="Product image"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className={classes.product_info}>
            <h1 className={classes.product_title}>{product.title}</h1>

            <hr className={classes.divider} />

            <div className={classes.description}>
              <h3>About this item</h3>
              <p>{product.description}</p>
            </div>

            <div className={classes.rating_container}>
              <Rating
                value={product.rating?.rate || 0}
                precision={0.1}
                readOnly
                className={classes.rating_stars}
                aria-label={`Rating: ${product.rating?.rate || 0} out of 5`}
              />
              <small className={classes.rating_count}>
                ({product.rating?.count || 0} reviews)
              </small>
            </div>

            <div className={classes.price_container}>
              <CurrencyFormat amount={product.price} />
            </div>

            <button
              className={classes.add_to_cart}
              onClick={addToCart}
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetail;
