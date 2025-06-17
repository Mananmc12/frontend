import React, { useState } from "react";
import axios from "axios";
import "../../../assets/search-emp/searchEmp.css";

const SearchEmp = ({ onFilter }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    team: "",
    doj: "",
  });

  const [dojCheck, setDojCheck] = useState(false);

  const toggleDateRange = () => setDojCheck(!dojCheck);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name, role, team, email, doj } = formData;

    try {
      const res = await axios.post("/api/admin/search", {
        name,
        role,
        team,
        email,
        doj,
      });
      onFilter(res.data);
      console.log(res.data);
    } catch (err) {
      console.log("Error: ", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={onSubmit}>
        <div className="row mt-3 px-3">
          <div className="col">
            <label htmlFor="name">Name</label>
            <div className="form-group">
              <input
                name="name"
                placeholder="Joey Tribbiani"
                type="text"
                id="name"
                className="form-control"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="col">
            <label htmlFor="role">Role</label>
            <div className="form-group">
              <input
                placeholder="Front End Developer"
                name="role"
                type="text"
                id="role"
                className="form-control mb-3"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="col">
            <label htmlFor="email">Email</label>
            <div className="form-group">
              <input
                placeholder="joey@gmail.com"
                name="email"
                type="email"
                id="email"
                className="form-control mb-3"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="col">
            <label htmlFor="team">Team</label>
            <div className="form-group">
              <input
                placeholder="Development"
                name="team"
                type="text"
                id="team"
                className="form-control mb-3"
                onChange={onChange}
              />
            </div>
          </div>

          <div className="col">
            <label htmlFor="doj">Date Of Joining</label>
            <div className="form-group">
              <input
                placeholder="Date"
                name="doj"
                type="date"
                id="doj"
                className="form-control"
                onChange={onChange}
              />
            </div>
          </div>

          <div
            className="col"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="form-group m-0 p-0">
              <button type="submit" className="btn btn-primary">
                <i
                  className="fas fa-search p-2"
                  style={{ cursor: "pointer", fontSize: "20px" }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchEmp;
