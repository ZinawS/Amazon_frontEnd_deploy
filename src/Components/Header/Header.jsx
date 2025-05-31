import React, { useContext } from "react";
import classes from "./Header.module.css";
import { FaSearch } from "react-icons/fa";
import { RiMapPinLine } from "react-icons/ri";
import { BiCart } from "react-icons/bi";
import LowerHeader from "./LowerHeader";
import { Link} from "react-router-dom";
import { DataContext } from "../../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import { Type } from "../../Utility/actionType";

function Header() {
  const [{ cart, user }, dispatch] = useContext(DataContext); // Added dispatch
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);


  return (
    <header className={classes.amazon_header}>
      {/* Top Navigation */}
      <div className={classes.header_top}>
        {/* Left Section */}
        <div className={classes.header_top_left}>
          {/* Logo */}
          <Link to="/" className={classes.header_logo} aria-label="Amazon Home">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="Amazon Logo"
              className={classes.logo}
            />
          </Link>

          {/* Delivery Location */}
          <div className={classes.header_delivery}>
            <RiMapPinLine className={classes.location_icon} />
            <div>
              <span className={classes.deliver_to}>Deliver to</span>
              <span className={classes.location}>Ethiopia</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={classes.header_search}>
          <select
            className={classes.search_select}
            aria-label="Category select"
          >
            <option value="all">All</option>
          </select>
          <input
            type="text"
            className={classes.search_input}
            placeholder="Search products"
          />
          <button className={classes.search_button} aria-label="Search">
            <FaSearch className={classes.search_icon} />
          </button>
        </div>

        {/* Right Section */}
        <div className={classes.header_top_right}>
          {/* Language Selector */}
          <div className={classes.nav_language}>
            <span className={classes.nav_flag}>🇺🇸</span>
            <select
              className={classes.language_select}
              aria-label="Language select"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="am">AM</option>
            </select>
          </div>

          {/* User Account */}
          <div className={classes.nav_item}>
            {user ? (
              <div className={classes.nav_account}>
                <span className={classes.nav_line1}>
                  Hello, {user.displayName || user.email.split("@")[0]}
                </span>
                <button
                  className={`${classes.nav_line2} ${classes.sign_out}`}
                  onClick={()=>{auth.signOut();
                    dispatch({type:Type.SET_USER,user:null})
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className={classes.nav_account}>
                <span className={classes.nav_line1}>Hello, Sign in</span>
                <span className={classes.nav_line2}>Account & Lists</span>
              </Link>
            )}
          </div>

          {/* Orders */}
          <Link
            to="/orders"
            className={`${classes.nav_item} ${classes.returns_container}`}
          >
            <div className={classes.nav_returns}>
              <span className={classes.nav_line1}>Returns</span>
              <span className={classes.nav_line2}>& Orders</span>
            </div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className={`${classes.nav_item} ${classes.cart}`}>
            <span className={classes.cart_count}>{totalQuantity}</span>
            <BiCart className={classes.cart_icon} />
            <span className={classes.cart_nav_line2}>Cart</span>
          </Link>
        </div>
      </div>

      {/* Lower Navigation */}
      <LowerHeader />
    </header>
  );
}

export default Header;
