import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AdminSidePanel from "./AdminSidePanel";
import "../../../assets/payroll/payroll.css";
import emptyImg from "../../../assets/payroll/empty.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";
import { useSpring, animated } from "react-spring";
import { Context } from "../../../context";

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [empReceiptsList, setEmpReceiptsList] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const curYear = new Date().getFullYear();

  const month = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fade = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 300 } });

  const onMonthClick = async (month) => {
    try {
      const res = await axios.get("/api/admin/getAllEmpsSalReceipt");
      const empSalReceipts = res.data;
      const monthlyData = empSalReceipts.map((emp) => {
        let eachEmp = {
          currentSalary: emp.currentSalary,
          empId: emp.empId,
          empName: emp.empName,
        };
        emp.monthlyReceipts.forEach((m) => {
          eachEmp[m.month] = m;
        });
        return eachEmp;
      });

      setSelectedMonth(month);
      setEmpReceiptsList(monthlyData);
    } catch (e) {
      console.error("Error fetching salary receipts:", e);
    }
  };

  const onGenerateSalReceipt = async (emp) => {
    try {
      const salDetails = await axios.get(`/api/admin/getUserSalDetails/${emp.empId}`);
      const res = await axios.put("/api/admin/generateSalReceipt", {
        empId: emp.empId,
        month: selectedMonth,
        year: curYear,
        salDetails: salDetails.data,
      });

      const updatedEmpReceiptDoc = res.data.updatedEmpReceiptDoc;
      const newReceipt = updatedEmpReceiptDoc.monthlyReceipts.at(-1);

      const updatedList = empReceiptsList.map((e) => {
        if (e.empId === updatedEmpReceiptDoc.empId) {
          return {
            ...e,
            [selectedMonth]: newReceipt,
          };
        }
        return e;
      });

      setEmpReceiptsList(updatedList);
      toast.success("Salary Receipt generated successfully");
    } catch (e) {
      console.error("Error generating salary receipt:", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/empDashBoard");
    }
  }, [user, navigate]);

  return (
    <div className="row m-0">
      {/* Left part */}
      <div className="col-2 p-0 leftPart">
        <AdminSidePanel />
      </div>

      {/* Right part */}
      <animated.div className="col mt-3" style={fade}>
        <div className="container">
          {/* Select month */}
          <div className="dropdown" style={{ float: "left" }}>
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {selectedMonth}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {month.map((m) => (
                <li
                  style={{ cursor: "pointer" }}
                  key={m}
                  className="dropdown-item btn-primary"
                  onClick={() => onMonthClick(m)}
                >
                  {m}
                </li>
              ))}
            </div>
          </div>

          {selectedMonth !== "Select Month" ? (
            <>
              <h1 className="my-3 text-right text-secondary">
                Payroll table for {selectedMonth}, {curYear}
              </h1>

              <Tooltip place="bottom" delayShow={100} html={true} />

              <table className="table table-hover table-border text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>
                      Action{" "}
                      <i
                        className="fas fa-info-circle text-secondary"
                        data-tip="Once salary slip is generated, <br /> bonus, total leaves of that employee will be cleared"
                      ></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {empReceiptsList.map((emp, index) => {
                    const receipt = emp[selectedMonth];
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{emp.empName}</td>
                        {receipt ? (
                          <>
                            <td>{receipt.salDetails.salary}</td>
                            <td>Generated</td>
                            <td>
                              <input
                                type="button"
                                className="btn btn-success"
                                value="Receipt Generated"
                                disabled
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{emp.currentSalary}</td>
                            <td>Pending</td>
                            <td>
                              <div className="dropdown">
                                <button
                                  className="btn btn-primary dropdown-toggle"
                                  type="button"
                                  data-toggle="dropdown"
                                >
                                  Take action
                                </button>
                                <div className="dropdown-menu">
                                  <li
                                    className="dropdown-item btn-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onGenerateSalReceipt(emp)}
                                  >
                                    Generate Receipt
                                  </li>
                                  <Link
                                    to={`/editEmpProfile/${emp.empId}`}
                                    className="dropdown-item"
                                  >
                                    View profile/Edit salary details
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2 className="text-center mt-3 emptyPicText text-secondary">
                <b>Select month to view details</b>
              </h2>
              <div className="d-flex justify-content-center">
                <img className="emptyPic" src={emptyImg} alt="No data" />
              </div>
            </>
          )}
        </div>
      </animated.div>
    </div>
  );
};

export default Payroll;
