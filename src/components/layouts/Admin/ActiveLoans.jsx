import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { Context } from "../../../context";
import AdminSidePanel from "./AdminSidePanel";
import empty from "../../../assets/images/empty.png";

const ActiveLoans = () => {
  const [activeLoanList, setActiveLoanList] = useState([]);
  const { user } = useContext(Context);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get("/api/admin/getLoanList");
        const active = res.data.filter((loan) => loan.loanRepaid === false);
        setActiveLoanList(active);
        console.log("loan list: ", active);
      } catch (error) {
        console.error("Error fetching loan list", error);
      }
    };

    fetchLoans();
  }, []);

  const onGetDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const token = localStorage.getItem("auth-token");

  const props = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, config: { duration: 300 } });

  return (
    <Context.Consumer>
      {(value) => {
        const { user } = value;

        if (!token) return <Navigate to="/login" replace />;
        if (user && user.role !== "admin") return <Navigate to="/empDashBoard" replace />;

        return (
          <animated.div style={props}>
            <div className="row m-0">
              <div className="col-2 p-0 leftPart">
                <AdminSidePanel />
              </div>
              <div className="col mt-3">
                {activeLoanList.length ? (
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Created On</th>
                        <th>Time Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeLoanList.map((loan, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <Link to={`/editEmpProfile/${loan.empId}`} style={{ textDecoration: "none" }}>
                              {loan.empName}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/viewSingleRequest/${loan.title}/${loan.reqId}`} style={{ textDecoration: "none" }}>
                              {loan.loanReason}
                            </Link>
                          </td>
                          <td>{onGetDate(loan.date)}</td>
                          <td>{loan.timePeriod} month(s)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-secondary mt-5">
                    <img src={empty} alt="" width="400px" />
                    <h1>No active loans</h1>
                  </div>
                )}
              </div>
            </div>
          </animated.div>
        );
      }}
    </Context.Consumer>
  );
};

export default ActiveLoans;
