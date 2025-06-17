import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";

import EmpCard from "./EmpCard";
import SearchEmp from "./SearchEmp";
import AdminSidePanel from "./AdminSidePanel";
import noEmp from "../../../assets/images/noEmp.png";
import { Context } from "../../../context";

const ViewEmployees = () => {
  const [empList, setEmpList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(Context);

  const fadeInProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 300 },
  });

  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("/api/admin/getEmpList");
        console.log("List: ", res.data);
        setEmpList(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching employee list:", err);
      }
    };

    fetchEmployees();
  }, []);

  const onFilter = (filteredList) => {
    setEmpList(filteredList);
  };

  if (!token) return <Navigate to="/login" />;
  if (user && user.role !== "admin") return <Navigate to="/empDashBoard" />;

  return (
    <div className="row m-0">
      {/* Left Panel */}
      <div className="col-2 p-0 leftPart">
        <AdminSidePanel />
      </div>

      {/* Right Panel */}
      <animated.div className="col" style={fadeInProps}>
        <div className="row">
          <SearchEmp onFilter={onFilter} />
        </div>

        <hr />

        {/* Employee List */}
        {loading ? (
          <h1 className="text-center">Loading...</h1>
        ) : empList.length ? (
          <div className="container">
            <div className="row" style={{ display: "flex" }}>
              {empList.map((emp, index) => (
                <EmpCard key={index} data={emp} />
              ))}
            </div>
          </div>
        ) : (
          <div className="container text-secondary text-center mt-2">
            <img src={noEmp} alt="No Employees" height="200px" className="mt-5" />
            <h1 className="mt-4">No Employees found...</h1>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default ViewEmployees;
