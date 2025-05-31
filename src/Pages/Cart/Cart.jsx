import React, { useContext } from "react";
import Layout from "../../Components/Layout/Layout";
import { DataContext } from "../../DataProvider/DataProvider";
import ProductCard from "../../Components/Product/productCard";
import classes from "./Cart.module.css";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { Link } from "react-router-dom";

function Cart() {
  const [state, dispatch] = useContext(DataContext);
  const { cart } = state;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Layout>
      <section className={classes.cart_container}>
        <div className={classes.cart_header}>
          <h1>Shopping Cart</h1>
          <div className={classes.cart_meta}>
            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            {/* <Link to="/">Deselect all items</Link> */}
          </div>
          <hr className={classes.divider} />
        </div>

        <div className={classes.cart_content}>
          <div className={classes.cart_items}>
            {cart.length === 0 ? (
              <div className={classes.empty_cart}>
                <h2>Your Amazon Cart is empty</h2>
                <Link to="/" className={classes.shop_link}>
                  Shop today's deals
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <ProductCard
                  key={`${item.id}-${item.quantity}`}
                  product={item}
                  renderDescr={true}
                  flex={true}
                  isCartPage={true}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className={classes.subtotal_container}>
              <div className={classes.subtotal}>
                <div className={classes.subtotal_summary}>
                  <p>
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"}
                    ):{" "}
                    <strong>
                      <CurrencyFormat amount={subtotal} />
                    </strong>
                  </p>
                  <div className={classes.gift_option}>
                    <input type="checkbox" id="gift" />
                    <label htmlFor="gift">This order contains a gift</label>
                  </div>
                </div>
                <Link to="/payments" className={classes.checkout_button}>
                  Proceed to checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Cart;
