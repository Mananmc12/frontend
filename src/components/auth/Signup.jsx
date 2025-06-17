import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring";
import { Context } from "../../context";
import loginAvatar from "../../assets/login-signup-styles/loginAvatar.png";
import notes from "../../assets/images/authentication.png";
import "../../assets/login-signup-styles/login-signup.css";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [checks, setChecks] = useState({
    emailCheck: false,
    password1Check: false,
    password2Check: false,
  });

  const { dispatch, token } = useContext(Context);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const { email, password, passwordCheck, name } = form;

    try {
      await axios.post("/api/admin/register", {
        email,
        password,
        passwordCheck,
        name,
      });

      const loggedInUser = await axios.post("/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("auth-token", loggedInUser.data.token);
      localStorage.setItem("userId", loggedInUser.data.user._id);

      dispatch({
        type: "LOGGED_IN",
        payload: {
          user: loggedInUser.data.user,
          token: loggedInUser.data.token,
        },
      });

      navigate("/");
    } catch (err) {
      setDisabled(false);
      setError(err?.response?.data?.msg || "Signup failed.");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    setChecks({
      emailCheck: updatedForm.email.includes("@") && updatedForm.email.includes("."),
      password1Check: updatedForm.password.length >= 6,
      password2Check: updatedForm.password === updatedForm.passwordCheck,
    });
  };

  if (token) {
    navigate("/");
    return null;
  }

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div style={props}>
          <div className="row m-0">
            <div className="col">
              <img className="signUpSVG" src={notes} alt="" />
            </div>
            <div className="col-12 col-sm-12 col-md-4">
              <div className="container">
                <form className="signUpForm" onSubmit={onSubmit} style={{ marginTop: "85px" }}>
                  <img className="signUpAvatar" src={loginAvatar} alt="" />
                  <h3 className="signUpText text-center mt-3">Create new Admin Account!</h3>
                  {error && <div className="alert alert-danger mt-4">{error}</div>}

                  <div className="col">
                    <div className="row">
                      <div className="col">
                        <input
                          type="email"
                          name="email"
                          className="form-control mb-3"
                          placeholder="Email id"
                          onChange={onChange}
                          required
                        />
                      </div>
                      {checks.emailCheck && (
                        <div className="col-1 correctContainer">
                          <i className="fa fa-check"></i>
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col">
                        <input
                          name="password"
                          type="password"
                          className="form-control mb-3"
                          placeholder="Password"
                          onChange={onChange}
                          required
                        />
                      </div>
                      {checks.password1Check && (
                        <div className="col-1 correctContainer">
                          <i className="fa fa-check"></i>
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col">
                        <input
                          name="passwordCheck"
                          type="password"
                          className="form-control mb-3"
                          placeholder="Re-enter password"
                          onChange={onChange}
                          required
                        />
                      </div>
                      {checks.password2Check && (
                        <div className="col-1 correctContainer">
                          <i className="fa fa-check"></i>
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col">
                        <input
                          name="name"
                          type="text"
                          className="form-control mb-3"
                          placeholder="Name"
                          onChange={onChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <input
                        disabled={disabled}
                        type="submit"
                        value="Signup"
                        className="btn btn-success"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
      )}
    </Spring>
  );
}

export default Signup;
