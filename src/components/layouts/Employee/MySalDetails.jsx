import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import EmpSidePanel from "./EmpSidePanel";
import "../../../assets/my-sal-details/mySalDetails.css";
import SalaryStructure from "./SalaryStructure";
import { Context } from "../../../context";
import { useNavigate } from "react-router-dom";
import { Spring } from "@react-spring/web";

const MySalReciept = () => {
  const [basicPay, setBasicPay] = useState("");
  const [totalLeaves, setTotalLeaves] = useState("");
  const [travelAllowance, setTravelAllowance] = useState("");
  const [medicalAllowance, setMedicalAllowance] = useState("");
  const [bonus, setBonus] = useState("");
  const [salary, setSalary] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Select Month");
  const [salDetails, setSalDetails] = useState(undefined);
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const curYear = new Date().getFullYear();
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchSalData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const userSalData = await axios.get(
          `/api/admin/getUserSalDetails/${userId}`
        );
        setBasicPay(userSalData.data.basicPay);
        setTotalLeaves(userSalData.data.totalLeaves);
        setTravelAllowance(userSalData.data.travelAllowance);
        setMedicalAllowance(userSalData.data.medicalAllowance);
        setBonus(userSalData.data.bonus);
        setSalary(userSalData.data.salary);
      } catch (e) {
        console.log(e);
      }
    };
    fetchSalData();
  }, []);

  const onMonthClick = (monthVal) => {
    setSelectedMonth(monthVal);
  };

  const onFindSalReceipt = async () => {
    const userId = localStorage.getItem("userId");
    const empSalReceipts = await axios.get(
      `/api/admin/getSingleEmpSalReceipts/${userId}`
    );
    let monthDetails;
    empSalReceipts.data.monthlyReceipts.forEach((item) => {
      if (item.month === selectedMonth) {
        monthDetails = item;
      }
    });
    setSalDetails(monthDetails);
  };

  const token = localStorage.getItem("auth-token");
  if (!token) {
    navigate("/login");
    return null;
  }
  if (user && user.role === "admin") {
    navigate("/");
    return null;
  }

  return (
    <Spring
      from={{
        transform: "translate3d(1000px,0,0) ",
      }}
      to={{
        transform: "translate3d(0px,0,0) ",
      }}
      config={{ friction: 20 }}
    >
      {(props) => (
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <EmpSidePanel />
          </div>
          {/* right part */}
          <div className="col rightPart container" style={props}>
            <div className="row ">
              <div className="col ">
                {/* current salary details */}
                <div className="mySalDetails mt-4">
                  <SalaryStructure
                    title="Salary Details"
                    basicPay={basicPay}
                    totalLeaves={totalLeaves}
                    travelAllowance={travelAllowance}
                    medicalAllowance={medicalAllowance}
                    bonus={bonus}
                    salary={salary}
                  />
                </div>
              </div>
            </div>
            {/* salary slip part */}
            <div className="row my-3">
              <div className="col">
                <div className="mySalDetails">
                  <h1>Payroll History</h1>
                  <hr />
                  {/* select month */}
                  <div className="row my-4">
                    {/* dropdown col */}
                    <div className="col">
                      <div className="dropdown">
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
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {month.map((m) => {
                            return (
                              <li
                                style={{ cursor: "pointer" }}
                                key={m}
                                className="dropdown-item btn-primary"
                                onClick={() => onMonthClick(m)}
                              >
                                {m}
                              </li>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {/* search button */}
                    <div className="col">
                      <input
                        type="button"
                        className="btn btn-primary btn-sm"
                        value="Search"
                        onClick={onFindSalReceipt}
                      />
                    </div>
                  </div>
                  {/* card */}
                  <div className="row">
                    <div className="col">
                      {salDetails ? (
                        <SalaryStructure
                          title={`${salDetails.month}, ${salDetails.year}`}
                          basicPay={salDetails.salDetails.basicPay}
                          totalLeaves={salDetails.salDetails.totalLeaves}
                          travelAllowance={salDetails.salDetails.travelAllowance}
                          medicalAllowance={salDetails.salDetails.medicalAllowance}
                          bonus={salDetails.salDetails.bonus}
                          salary={salDetails.salDetails.salary}
                        />
                      ) : (
                        <h6 className="mt-3">No data available to display</h6>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default MySalReciept;
