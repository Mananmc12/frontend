import React, { useState } from "react";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import contactUs from "../../assets/images/contactUs.png";
import { Spring } from "@react-spring/web";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setError("");
    if (name === "name") setName(value);
    else if (name === "email") setEmail(value);
    else if (name === "message") setMessage(value);
  };

  const submit = async (e) => {
    e.preventDefault();
    let trimmedName = name.trim();
    let trimmedEmail = email.trim();
    let trimmedMessage = message.trim();
    if (
      trimmedName.length === 0 ||
      trimmedEmail.length === 0 ||
      trimmedMessage.length === 0
    ) {
      setError("failure");
    } else {
      const contactMessage = {
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      };
      try {
        await axios.post("/api/email/contactUs", contactMessage);
        setName("");
        setEmail("");
        setMessage("");
        setError("success");
        toast.notify("Successfully submitted your message", {
          position: "top-right",
        });
      } catch (err) {
        setError("failure");
        console.log(err);
      }
    }
  };

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div className="container mt-5" style={props}>
          <div className="row">
            <div className="col">
              <img className="loginSVG" src={contactUs} alt="" />
            </div>
            <div className="col">
              <form className="addEmpForm" onSubmit={submit}>
                <h1 className="text-center">Contact Us</h1>
                <div className="form-group">
                  {error ? (
                    error === "success" ? (
                      <div className="alert alert-success">
                        Successfully submitted your message!
                      </div>
                    ) : (
                      <div className="alert alert-danger">
                        Please enter all the fields!
                      </div>
                    )
                  ) : null}
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={onChange}
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    className="form-control"
                    id="email"
                    onChange={onChange}
                    name="email"
                    placeholder="example@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Your message/suggestion</label>
                  <textarea
                    className="form-control"
                    value={message}
                    onChange={onChange}
                    id="message"
                    name="message"
                    rows="3"
                  ></textarea>
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Submit"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default ContactUs;
