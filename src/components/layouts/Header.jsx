import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context";
import "../../assets/header-styles/header.css";

const Header = ({ branding }) => {
  const { dispatch, token, user } = useContext(Context);
  const localToken = localStorage.getItem("auth-token");

  const OnLogout = () => {
    localStorage.setItem("auth-token", "");
    localStorage.setItem("userId", "");
    dispatch({
      type: "LOGGED_OUT",
    });
  };

  return (
    <div className="header">
      <Link to="/" className="header-title">{branding}</Link>
      <nav className="header-nav">
        <Link to="/about" className="header-link">About</Link>
        {localToken ? (
          <>
            <span onClick={OnLogout} className="header-link" style={{ cursor: "pointer" }}>Logout</span>
            {user && user.role !== "admin" ? (
              <Link to="/profile" className="header-link">{user.name}</Link>
            ) : (
              <span className="header-link">{user?.name}</span>
            )}
          </>
        ) : (
          <>
            <Link to="/signup" className="header-link">SignUp</Link>
            <Link to="/login" className="header-link">Login</Link>
          </>
        )}
        <Link to="/contactUs" className="header-link">Contact Us</Link>
      </nav>
    </div>
  );
};

export default Header;
