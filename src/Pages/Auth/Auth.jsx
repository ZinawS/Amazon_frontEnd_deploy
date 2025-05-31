import React, { useState, useContext } from "react";
import classes from "./SignUp.module.css";
import Layout from "../../Components/Layout/Layout";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/amazon_logo.png";
import { auth } from "../../Utility/firebase";
import { Type } from "../../Utility/actionType";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { DataContext } from "../../DataProvider/DataProvider";
import { ClipLoader } from "react-spinners";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    signIn: false,
    signUp: false,
  });
  const [createAccount, setCreateAccount] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const [{ user, cart }, dispatch] = useContext(DataContext);
  const location = useLocation();

  // Get redirect path from location state or default to home
  const redirectPath = location?.state?.redirect || "/";
  const message = location?.state?.msg;

  const errorMap = {
    "auth/user-not-found": "No user found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "Email already in use.",
    "auth/invalid-email": "Invalid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
  };

  const authHandler = async (e) => {
    e.preventDefault();
    const action = e.target.name;

    if (action === "signIn") {
      try {
        setLoading({ ...loading, signIn: true });
        const userInfo = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        dispatch({ type: Type.SET_USER, user: userInfo.user });
        setLoading({ signIn: false, signUp: false });

        // Always redirect to original page after sign-in
        navigate(redirectPath);
      } catch (error) {
        const cleanMessage =
          errorMap[error.code] || "An unexpected error occurred.";
        setError(cleanMessage);
        setLoading({ signIn: false, signUp: false });
      }
    }

    if (action === "signUp") {
      if (!createAccount) {
        setCreateAccount(true);
        return;
      }

      try {
        setLoading({ ...loading, signUp: true });
        const userInfo = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userInfo.user, { displayName: name });

        // Update user context
        dispatch({ type: Type.SET_USER, user: userInfo.user });

        setSuccess(true);
        setError("");
        setCreateAccount(false);

        // Always redirect to original page after sign-up
        navigate(redirectPath);

        // Clear form after navigation
        setName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        const cleanMessage =
          errorMap[error.code] || "An unexpected error occurred.";
        setError(cleanMessage);
        setSuccess(false);
        setLoading({ signIn: false, signUp: false });
      }
    }
  };

  return (
    <Layout>
      <section className={classes.auth_container}>
        <Link to="/" className={classes.logo_link}>
          <img src={logo} alt="Amazon Logo" className={classes.logo} />
        </Link>

        <div className={classes.auth_form_container}>
          {success && (
            <small
              style={{ color: "green", marginTop: "10px", display: "block" }}
            >
              Account Created Successfully! You are now signed in.
            </small>
          )}

          <h1 className={classes.auth_title}>Sign in</h1>
          {message && (
            <small style={{ color: "red",padding:"5px",textAlign:"center" , fontWeight:"bold",display:"block"}}>{message}</small>
          )}
          <form className={classes.auth_form}>
            <div className={classes.form_group}>
              {createAccount && (
                <div className={classes.form_group}>
                  <label htmlFor="name">Your name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={classes.form_group}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={classes.auth_button}
              onClick={authHandler}
              name="signIn"
              disabled={loading.signIn || loading.signUp}
            >
              {loading.signIn ? (
                <ClipLoader color="#000" size={15} />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className={classes.auth_terms}>
            <p>
              By signing in you agree to the AMAZON FAKE CLONE Conditions of Use
              & Sale. Please see our Privacy Notice, Cookies Notice and
              Interest-Based Ads Notice.
            </p>
          </div>

          <button
            className={classes.auth_switch_button}
            name="signUp"
            onClick={authHandler}
            disabled={loading.signIn || loading.signUp}
          >
            {loading.signUp ? (
              <ClipLoader color="#000" size={15} />
            ) : createAccount ? (
              "Sign Up"
            ) : (
              "Create your Amazon account"
            )}
          </button>

          {error && (
            <small
              style={{ paddingTop: "5px", color: "red", fontWeight: "bold" }}
            >
              {error}
            </small>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default Auth;
