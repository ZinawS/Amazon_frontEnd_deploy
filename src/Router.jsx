import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Landing from "./Pages/Landing/Landing";
import Auth from "./Pages/Auth/Auth";
import Payments from "./Pages/Payments/Payments";
import Orders from "./Pages/Orders/Orders";
import Results from "./Pages/Results/Results";
import Cart from "./Pages/Cart/Cart";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Protected_Routes from "./Protected_Routes/Protected_Routes";

// Replace with your real Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51RJ6NfB14OCoEGVMx95JADT1bBzP2VwKLdJYqDUcnKpS5d4Zc0FCRRSvbdts93EdJT9MFYxJ9KBJkTPeQimySw1Q00OsISc5hY"
);

function Routering() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/payments"
          element={
            <Protected_Routes msg="You must login to pay" redirect="/payments">
              <Elements stripe={stripePromise}>
                <Payments />
              </Elements>
            </Protected_Routes>
          }
        />
        <Route
          path="/orders"
          element={
            <Protected_Routes msg="You must login to see your orders" redirect="/orders">
              <Orders />
            </Protected_Routes>
          }
        />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default Routering;
