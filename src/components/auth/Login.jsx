import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spring } from "@react-spring/web";
import { Context } from "../../context";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import authentication from "../../assets/images/login.png";
import "../../assets/login-signup-styles/login-signup.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { dispatch, token } = useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const { email, password } = form;

    try {
      let loggedInUser;

      try {
        loggedInUser = await axios.post(`/api/admin/login`, { email, password });
      } catch {
        loggedInUser = await axios.post(`/api/users/login`, { email, password });
      }

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user._id);

      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
        },
      });

      navigate(email === "admin@gmail.com" ? "/" : "/empDashBoard");
    } catch (err) {
      setDisabled(false);
      setError(err?.response?.data?.msg || "Login failed.");
    }
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (token) {
    navigate("/");
    return null;
  }

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div style={props}>
          <div className="login-page-container">
            <img className="loginSVG" src={authentication} alt="" />
            <form className="loginForm" onSubmit={onSubmit}>
              <img className="loginAvatar" src={loginAvatar} alt="" />
              <h3 className="loginText text-center mt-3">Login to Your Account</h3>
              {error && <div className="alert alert-danger mt-4">{error}</div>}
              <input
                type="email"
                name="email"
                className="form-control mb-3 mt-4"
                placeholder="Email id"
                onChange={onChange}
                required
              />
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={onChange}
                required
              />
              <input
                disabled={disabled}
                type="submit"
                value="Login"
                className="btn btn-success btn-block mt-3"
              />
              <h6 className="mt-3 alert alert-warning text-center">
                <div className="row">
                  <div className="col">
                    Admin: admin@gmail.com <br />
                    User: {"<user>@gmail.com"} <br />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col">Default password for all: password</div>
                </div>
              </h6>
            </form>
          </div>
        </div>
      )}
    </Spring>
  );
}

export default Login;
