import React, { useContext, useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { DataContext } from "../../DataProvider/DataProvider";
import styles from "./Orders.module.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Utility/firebase";

function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.uid) {
        // Changed from email to uid
        try {
          // Corrected collection path to match where orders are stored
          //  db.collection("users").doc(user.uid).collection("orders").orderBy("created","desc").onSnapshot((snapshot)=>{
          //   console.log(snapshot);
          //  })
          const ordersRef = collection(db, "users", user.uid, "orders");
          const querySnapshot = await getDocs(ordersRef);
          console.log(querySnapshot);
          let ordersData = [];
          ordersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sort orders by date (newest first)
          ordersData.sort((a, b) => b.created - a.created);

          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  // Format Firestore timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    // If timestamp is in seconds (from paymentIntent), convert to milliseconds
    const date =
      typeof timestamp === "number"
        ? new Date(timestamp * 1000)
        : timestamp.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.orders__container}>
          <h2 className={styles.orders__title}>Your Orders</h2>

          {loading ? (
            <div className={styles.loading}>Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className={styles.empty}>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className={styles.orders__list}>
              {orders.map((order) => (
                <div key={order.id} className={styles.order__card}>
                  <div className={styles.order__header}>
                    <div>
                      <span className={styles.order__label}>Order Placed:</span>
                      <span>{formatDate(order.created)}</span>
                    </div>
                    <div>
                      <span className={styles.order__label}>Total:</span>
                      <span>${order.amount?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className={styles.order__label}>Order #:</span>
                      <span>{order.orderId || order.id}</span>
                    </div>
                    <div>
                      <span className={styles.order__label}>Status:</span>
                      <span className={styles[`status-${order.status}`]}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className={styles.order__items}>
                    {order.cart?.map((item) => (
                      <div key={item.id} className={styles.order__item}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.item__image}
                        />
                        <div className={styles.item__details}>
                          <h3 className={styles.item__title}>{item.title}</h3>
                          <p className={styles.item__price}>${item.price}</p>
                          <p className={styles.item__quantity}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Orders;
