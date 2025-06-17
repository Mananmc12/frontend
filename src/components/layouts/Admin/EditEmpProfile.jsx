import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../../../context";
import LoanDetailsCard from "./LoanDetailsCard";

const EditEmpProfile = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const token = localStorage.getItem("auth-token");

  const [form, setForm] = useState({
    id: "",
    name: "",
    phoneNo: "",
    email: "",
    gender: "",
    address: "",
    role: "",
    team: "",
    doj: "",
    skills: "",
    objective: "",
  });

  const [teamList, setTeamList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [salaryDetails, setSalaryDetails] = useState({
    basicPay: "",
    totalLeaves: "",
    travelAllowance: "",
    medicalAllowance: "",
    bonus: "",
    salary: "",
  });

  const [empLoanHistory, setEmpLoanHistory] = useState([]);

  const props = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, config: { duration: 300 } });

  useEffect(() => {
    const fetchData = async () => {
      const userData = await axios.get(`/api/admin/getUserData/${userId}`);
      const userSalData = await axios.get(`/api/admin/getUserSalDetails/${userId}`);
      const teamAndRoleList = await axios.get("/api/admin/getTeamsAndRoles");
      const empLoanHistory = await axios.get(`/api/admin/getEmpLoanHistory/${userId}`);

      setForm({
        id: userData.data._id,
        name: userData.data.name,
        address: userData.data.address,
        gender: userData.data.gender,
        email: userData.data.email,
        role: userData.data.role,
        team: userData.data.team,
        phoneNo: userData.data.phoneNo,
        objective: userData.data.objective,
        doj: userData.data.doj,
        skills: userData.data.skills,
      });

      setTeamList(teamAndRoleList.data[0].teamNames);
      setRoleList(teamAndRoleList.data[0].roleNames);

      setSalaryDetails({
        basicPay: userSalData.data.basicPay,
        totalLeaves: userSalData.data.totalLeaves,
        travelAllowance: userSalData.data.travelAllowance,
        medicalAllowance: userSalData.data.medicalAllowance,
        bonus: userSalData.data.bonus,
        salary: userSalData.data.salary,
      });

      setEmpLoanHistory(empLoanHistory.data);
    };

    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalaryChange = (e) => {
    setSalaryDetails({ ...salaryDetails, [e.target.name]: e.target.value });
  };

  const handleTeamSelect = (team) => setForm({ ...form, team });
  const handleRoleSelect = (role) => setForm({ ...form, role });
  const handleGenderSelect = (gender) => setForm({ ...form, gender });

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/updateProfile", {
        user: form,
        id: form.id,
      });
      toast.success("Updated profile", { position: "top-right" });
      console.log(res.data);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const updateSalDetails = async () => {
    try {
      const res = await axios.put(`/api/admin/updateSalaryDetails/${form.id}`, {
        salDetails: salaryDetails,
      });
      toast.success("Updated salary details", { position: "top-right" });
      console.log(res.data);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const calculateSalary = () => {
    const {
      basicPay,
      totalLeaves,
      travelAllowance,
      medicalAllowance,
      bonus,
    } = salaryDetails;

    let totalSal =
      parseInt(basicPay || 0) +
      parseInt(travelAllowance || 0) +
      parseInt(medicalAllowance || 0) +
      parseInt(bonus || 0);

    const perDaySal = totalSal / 30;
    if (totalLeaves > 3) {
      totalSal -= parseInt((totalLeaves - 3) * perDaySal);
    }

    setSalaryDetails({ ...salaryDetails, salary: totalSal });
  };

  const handleDelete = async () => {
    try {
      const adminId = localStorage.getItem("userId");
      await axios.delete(`/api/admin/delete/${form.id}`, {
        data: { adminId },
      });
      toast.success("Deleted profile successfully", { position: "top-right" });
      navigate("/viewEmployees");
    } catch (e) {
      console.log("Error", e);
    }
  };

  const onGetDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const onMarkAsPaid = async (loanDetails) => {
    try {
      await axios.put("/api/admin/loanPaid", {
        loanId: loanDetails._id,
        empId: loanDetails.empId,
        reqId: loanDetails.reqId,
      });
      toast.success("Successfully marked loan as paid", { position: "top-right" });
      const updatedLoans = empLoanHistory.map((loan) =>
        loan.reqId === loanDetails.reqId
          ? { ...loan, loanRepaid: true }
          : loan
      );
      setEmpLoanHistory(updatedLoans);
    } catch (e) {
      console.log(e);
    }
  };

  if (!token) return <Navigate to="/login" replace />;
  if (user && user.role !== "admin") return <Navigate to="/empDashBoard" replace />;

  return (
    <animated.div style={props}>
      <div className="container">
        <div className="row m-0">
          {/* col 1*/}
          <div className="col">
            <div className="row">
              {/* profile details */}
              <div className="col">
                <form
                  className="addEmpForm"
                  onSubmit={this.updateProfile.bind(this)}
                >
                  <h3>Employee Profile</h3>
                  <hr />

                  <div className="row">
                    <div className="col">
                      {/* name */}
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={this.state.name}
                        onChange={this.onChange}
                        required
                      />
                    </div>
                    <div className="col">
                      {/* email */}
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        className="form-control mb-3 "
                        onChange={this.onChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      {/* address */}
                      <label htmlFor="address">Address</label>
                      <textarea
                        name="address"
                        value={this.state.address}
                        id="address"
                        rows="1"
                        className="form-control mb-3 "
                        onChange={this.onChange}
                        required
                      />
                    </div>
                    <div className="col">
                      {/* phone no */}
                      <label htmlFor="phoneNo">Phone No.</label>
                      <input
                        type="number"
                        value={this.state.phoneNo}
                        name="phoneNo"
                        className="form-control mb-3 "
                        onChange={this.onChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    {/* team */}
                    <div className="col">
                      <label htmlFor="team">Team</label>
                      <div className="dropdown">
                        <button
                          className="btn btn-light dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.team}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {this.state.teamList.map((teamName) => (
                            <li
                              key={teamName}
                              className="dropdown-item"
                              onClick={() =>
                                this.onTeamSelect(teamName)
                              }
                            >
                              {teamName}
                            </li>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* role */}
                    <div className="col">
                      <label htmlFor="role">Role</label>
                      <div className="dropdown mb-3">
                        <button
                          className="btn btn-light dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {this.state.role}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {this.state.roleList.map((roleName) => (
                            <li
                              key={roleName}
                              className="dropdown-item"
                              onClick={() =>
                                this.onRoleSelect(roleName)
                              }
                            >
                              {roleName}
                            </li>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* doj */}
                    <div className="col">
                      <label htmlFor="doj">Date Of Joining</label>
                      <input
                        type="date"
                        name="doj"
                        value={this.state.doj}
                        className="form-control mb-3 "
                        onChange={this.onChange}
                        required
                      />
                    </div>

                    {/* gender */}
                    <div className="col">
                      <div className="col">
                        <label>Gender</label>
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {this.state.gender}
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li
                              className="dropdown-item"
                              onClick={() =>
                                this.onSelectGender("Male")
                              }
                            >
                              Male
                            </li>
                            <li
                              className="dropdown-item"
                              onClick={() =>
                                this.onSelectGender("Female")
                              }
                            >
                              Female
                            </li>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <label htmlFor="skills">Skills</label>
                      <textarea
                        disabled={true}
                        type="text"
                        name="skills"
                        value={this.state.skills}
                        className="form-control mb-3 "
                        required
                      />
                    </div>
                  </div>
                  <input
                    disabled={this.state.disabled}
                    type="submit"
                    value="Submit"
                    className="btn btn-primary btn-block "
                  />
                </form>
              </div>
            </div>

            <div className="row mb-5">
              {/* emp loan history */}
              <div className="col">
                {this.state.empLoanHistory.length ? (
                  <form
                    className="addEmpForm"
                    style={{ height: "460px", overflowY: "scroll" }}
                  >
                    <h3>Employee Loan History</h3>
                    <hr />

                    {this.state.empLoanHistory.map((loan) => (
                      <LoanDetailsCard
                        key={loan.reqId}
                        isAdmin={
                          user && user.role === "admin" ? true : false
                        }
                        loanDetails={loan}
                        onGetDate={this.onGetDate}
                        onMarkAsPaid={this.onMarkAsPaid}
                      />
                    ))}
                  </form>
                ) : // <div className="addEmpForm">
                //   <h3>No loan history available</h3>
                // </div>
                null}
              </div>
            </div>
          </div>

          {/* salary details col2 */}
          <div className="col">
            <form className="addEmpForm">
              <h3>Employee Salary Details</h3>
              <hr />
              <div className="form-group">
                <label htmlFor="basicPay">Basic Pay</label>
                <input
                  name="basicPay"
                  type="number"
                  className="form-control"
                  id="basicPay"
                  value={this.state.basicPay}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="travelAllowance">
                  Travel Allowance
                </label>
                <input
                  name="travelAllowance"
                  type="number"
                  className="form-control"
                  id="travelAllowance"
                  value={this.state.travelAllowance}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="medicalAllowance">
                  Medical Allowance
                </label>
                <input
                  name="medicalAllowance"
                  type="number"
                  className="form-control"
                  id="medicalAllowance"
                  value={this.state.medicalAllowance}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bonus">Bonus</label>
                <input
                  name="bonus"
                  type="number"
                  min="0"
                  className="form-control"
                  id="bonus"
                  value={this.state.bonus}
                  onChange={this.onChange}
                />
              </div>

              <p>Total leaves: {this.state.totalLeaves}</p>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  disabled={true}
                  defaultValue={this.state.salary}
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    id="button-addon2"
                    onClick={this.onCalSal}
                  >
                    Calculate Salary
                  </button>
                </div>
              </div>

              <input
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.updateSalDetails}
                value="Update Salary Details"
              />
            </form>
          </div>

          {/* option col 3 */}
          <div className="col-1 mt-5">
            <input
              className="btn btn-danger"
              type="button"
              value="Delete profile"
              onClick={this.onDelete}
            />

            <Link to="/statistics">
              <input
                className="btn btn-primary mt-3"
                type="button"
                value="Go to Dashboard"
              />
            </Link>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default EditEmpProfile;
