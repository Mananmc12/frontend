import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../../assets/side-panel-styles/sidePanel.css";

const AdminSidePanel = () => {
  const [admin, setAdmin] = useState();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("auth-token");

        const tokenRes = await axios.post("/api/admin/tokenIsValid", null, {
          headers: { "x-auth-token": token },
        });

        if (tokenRes.data) {
          const adminRes = await axios.get("/api/admin", {
            headers: { "x-auth-token": token },
          });
          console.log("admin profile: ", adminRes.data.user);
          setAdmin(adminRes.data.user);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchAdmin();
  }, []);

  const currLocation = window.location.href.split("#/")[1];

  return (
    <div className="mt-4">
      <Link to="/statistics" style={{ textDecoration: "none" }}>
        <li className="list-group-item text-dark border-0 my-1 myList">
          <i className="fas fa-chart-bar mr-4" style={{ fontSize: "20px" }}></i>{" "}
          {currLocation === "statistics" || currLocation === "" ? <b>Statistics</b> : "Statistics"}
        </li>
      </Link>

      <ul className="list-group">
        <Link to="/add" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-user-plus mr-4" style={{ fontSize: "20px" }}></i>
            {currLocation === "add" ? <b>Add Employee</b> : "Add Employee"}
          </li>
        </Link>

        <Link to="/viewEmployees" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-search mr-4" style={{ fontSize: "20px" }}></i>
            {currLocation === "viewEmployees" ? <b>View Employee</b> : "View Employee"}
          </li>
        </Link>

        <Link to="/viewRequests" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-comments mr-4" style={{ fontSize: "20px" }}></i>
            {currLocation === "viewRequests" ? <b>View Requests</b> : "View Requests"}
            {admin &&
              (admin.leaveRequests.length ||
                admin.bonusRequests.length ||
                admin.loanRequests.length) ? (
              <div
                className="fas fa-circle ml-2"
                style={{ color: "#FF1D15", fontSize: "8px" }}
              ></div>
            ) : null}
          </li>
        </Link>

        <Link to="/payroll" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-file-invoice mr-4" style={{ fontSize: "20px" }}></i>
            {currLocation === "payroll" ? <b>Payroll</b> : "Payroll"}
          </li>
        </Link>

        <Link to="/activeLoans" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-hand-holding-usd mr-4" style={{ fontSize: "20px" }}></i>
            {currLocation === "activeLoans" ? <b>Active Loans</b> : "Active Loans"}
          </li>
        </Link>

        <Link to="/options" style={{ textDecoration: "none" }}>
          <li className="list-group-item text-dark border-0 my-1 myList">
            <i className="fas fa-sliders-h mr-4" style={{ fontSize: "20px" }}></i>
            {currLocation === "options" ? <b>Options</b> : "Options"}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default AdminSidePanel;
