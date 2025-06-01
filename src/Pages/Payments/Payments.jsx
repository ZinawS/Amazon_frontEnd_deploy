import React, { useState, useContext } from "react";
import Layout from "../../Components/Layout/Layout";
import styles from "./payments.module.css";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import { Type } from "../../Utility/actionType";
import ProductCard from "../../Components/Product/productCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import apiClient from "../../Api/axios";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore"; // Fixed import

function Payments() {
  const [{ cart, user }, dispatch] = useContext(DataContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Calculate cart metrics
  const totalItems = cart?.reduce((acc, item) => acc + item?.quantity, 0);
  const cartSubtotal = cart?.reduce(
    (acc, item) => acc + item?.price * item?.quantity,
    0
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    if (e?.error?.message) {
      setCardError(e?.error?.message);
    } else {
      setCardError("");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Guard against empty cart
    if (cart.length === 0) {
      setCardError("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    setCardError("");

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    try {
      // Calculate amount with proper rounding
      const amountInCents = Math.round(cartSubtotal * 100);

      // Validate amount
      if (isNaN(amountInCents) || amountInCents < 50) {
        throw new Error("Invalid payment amount");
      }

      const response = await apiClient.post("/payment/create", {
        amount: amountInCents,
      });

      // console.log("PaymentIntent created:", response.data);

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(response.data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || "Guest",
            },
          },
        });

      if (stripeError) {
        throw stripeError;
      }
      // Generate order ID
      const newOrderId = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      // setOrderId(newOrderId);
      // FIXED DATABASE WRITING USING MODULAR SYNTAX
      const ordersRef = collection(db, "users", user.uid, "orders");
      const orderDocRef = doc(ordersRef, newOrderId);

      await setDoc(orderDocRef, {
        cart: cart,
        amount: cartSubtotal,
        created: paymentIntent.created,
        orderId: newOrderId,
        status: "completed",
      });

      // Clear cart
      dispatch({ type: Type.EMPTY_CART });
      setPaymentSuccess(true);
      navigate("/orders", { state: { msg: "You have placed new Order" } });
    } catch (error) {
      console.error("Payment error:", {
        message: error.message,
        response: error.response?.data,
        code: error.code,
      });

      setCardError(
        error.response?.data?.error ||
          error.message ||
          "Payment processing failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Layout>
        <div className={styles.successContainer}>
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          <p>
            Order ID:{" "}
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
          <Link to="/" className={styles.returnButton}>
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className={styles.Payments_header}>
        Checkout ({totalItems}) {totalItems === 1 ? "item" : "items"}
      </div>

      {/* Payment Sections */}
      <section className={styles.payment}>
        {/* Delivery Address */}
        <div className={styles.flex}>
          <h3>Delivery Address</h3>
          <div className={styles.userInfo}>
            <div>{user?.displayName}</div>
            <div>123 Main St, Silver Spring, MD 20901</div>
          </div>
        </div>
        <hr />

        {/* Order Summary */}
        <div className={styles.flex}>
          <h3>Review items and delivery</h3>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <ProductCard
                key={`${item.id}-${item.quantity}`}
                product={item}
                renderDescr={false}
                flex={true}
                isCartPage={true}
              />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Form */}
        <div className={styles.flex}>
          <h3>Payment Method</h3>
          <div className={styles.payment_card_container}>
            <div className={styles.payment_details}>
              <form onSubmit={handlePayment}>
                {cardError && (
                  <div className={styles.errorMessage}>{cardError}</div>
                )}

                <div className={styles.cardElementContainer}>
                  <CardElement
                    onChange={handleChange}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />
                </div>

                <div className={styles.payment_price}>
                  <div className={styles.orderTotal}>
                    <p>Total Order:</p>
                    <p className={styles.totalAmount}>
                      <CurrencyFormat amount={cartSubtotal} />
                    </p>
                  </div>
                  <button
                    className={styles.payment_button}
                    disabled={isProcessing || !stripe || cart.length === 0}
                  >
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payments;
