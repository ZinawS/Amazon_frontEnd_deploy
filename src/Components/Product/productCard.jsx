import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import classes from "./product.module";
import { Link } from "react-router-dom";
import { Type } from "../../Utility/actionType";
import { DataContext } from "../../DataProvider/DataProvider";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

function ProductCard({
  product,
  flex = false,
  renderDescr,
  isCartPage = false,
}) {
  const { image, title, rating, price, id, description } = product;
  const [state, dispatch] = useContext(DataContext);

  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_CART,
      item: {
        id,
        image,
        title,
        price,
        rating,
        description,
      },
    });
  };

  const removeFromCart = () => {
    dispatch({
      type: Type.REMOVE_FROM_CART,
      id: id,
    });
  };

  const increaseQuantity = () => {
    dispatch({
      type: Type.INCREMENT_QUANTITY,
      id: id,
    });
  };

  const decreaseQuantity = () => {
    if (product.quantity > 1) {
      dispatch({
        type: Type.DECREMENT_QUANTITY,
        id: id,
      });
    } else {
      removeFromCart();
    }
  };

  return (
    <>
      {isCartPage ? (
        <div className={classes.flex_layout}>
          <div className={classes.product_main}>
            <div className={classes.image_side}>
              <div className={classes.cart_image_container}>
                <img src={image} alt={title || "Product"} />
              </div>
            </div>

            <div className={classes.product_info}>
              <h1 className={classes.product_title}>{title}</h1>
              {renderDescr && (
                <>
                  <hr className={classes.divider} />
                  <div className={classes.description}>
                    <h3>About this item</h3>
                    <p>{description}</p>
                  </div>
                </>
              )}
              <div className={classes.rating}>
                <Rating
                  value={rating?.rate || 0}
                  precision={0.1}
                  readOnly
                  className={classes.rating_stars}
                />
                <small className={classes.rating_count}>
                  {rating?.count || 0}
                </small>
              </div>

              <div className={classes.price_container}>
                <span className={classes.price_amount}>
                  <CurrencyFormat amount={price} />
                </span>
              </div>
            </div>
            <div className={classes.quantity_controls}>
              <span>Qty:</span>
              <div className={classes.quantity_buttons}>
                <button
                  onClick={increaseQuantity}
                  className={classes.quantity_button}
                >
                  <FaChevronUp />
                </button>
                <span className={classes.quantity_value}>
                  {product.quantity || 1}
                </span>
                <button
                  onClick={decreaseQuantity}
                  className={classes.quantity_button}
                >
                  <FaChevronDown />
                </button>
                <button
                  onClick={removeFromCart}
                  className={classes.delete_button}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.card_container}>
          <Link to={`/products/${id}`} className={classes.image_link}>
            <img src={image} alt={title} className={classes.product_image} />
          </Link>
          <div className={classes.product_details}>
            <Link to={`/products/${id}`}>
              <h3 className={classes.product_title}>{title}</h3>
            </Link>
            <div className={classes.rating}>
              <Rating
                value={rating?.rate || 0}
                precision={0.1}
                readOnly
                className={classes.rating_stars}
              />
              <small className={classes.rating_count}>
                {rating?.count || 0}
              </small>
            </div>
            <div className={classes.price_container}>
              <span className={classes.price_amount}>
                <CurrencyFormat amount={price} />
              </span>
            </div>
            <div className={classes.button_container}>
              <button className={classes.button} onClick={addToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
