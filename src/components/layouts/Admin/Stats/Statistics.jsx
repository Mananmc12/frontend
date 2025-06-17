import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Spring } from "react-spring";
import axios from "axios";

import PieChart from "./PieChart";
import BarChart from "./BarChart";
import BarChart2 from "./BarChart2";
import LineChart from "./LineChart";
import AdminSidePanel from "../AdminSidePanel";
import "../../../../assets/stats-styles/stats.css";
import Card from "./Card";
import { Context } from "../../../../context";

function Statistics() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [empList, setEmpList] = useState([]);
  const [empSalList, setEmpSalList] = useState([]);
  const [loanList, setLoanList] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loanExpenses, setLoanExpenses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, salRes, loanRes] = await Promise.all([
          axios.get("/api/admin/getEmpList"),
          axios.get("/api/admin/getEmpSalList"),
          axios.get("/api/admin/getLoanList"),
        ]);

        setEmpList(empRes.data);
        setEmpSalList(salRes.data);
        setLoanList(loanRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let total = empSalList.reduce((sum, emp) => sum + parseInt(emp.salary), 0);
    setTotalExpenses(total);
  }, [empSalList]);

  useEffect(() => {
    let totalLoan = loanList.reduce(
      (sum, loan) => (loan.loanRepaid ? sum : sum + parseInt(loan.amount)),
      0
    );
    setLoanExpenses(totalLoan);
  }, [loanList]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) navigate("/login");
    if (user && user.role !== "admin") navigate("/empDashBoard");
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div className="row m-0">
          {/* left panel */}
          <div className="col-2 p-0 leftPart">
            <AdminSidePanel />
          </div>

          {/* right panel */}
          <div className="col-9 rightPart container" style={props}>
            {/* cards */}
            <div className="row mt-5">
              <div className="col">
                <Card label="Salary Expenses" data={`₹ ${totalExpenses}`} />
              </div>
              <div className="col">
                <Card label="Loan Expenses" data={`₹ ${loanExpenses}`} />
              </div>
              <div className="col">
                <Card label="Employee Count" data={empList.length} />
              </div>
            </div>

            {/* charts */}
            <div className="row mt-5">
              <div className="col-6 my-4">
                <PieChart />
              </div>
              <div className="col-6 my-4">
                <BarChart />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-6 my-4">
                <BarChart2 />
              </div>
              <div className="col-6 my-4">
                <LineChart />
              </div>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
}

export default Statistics;
