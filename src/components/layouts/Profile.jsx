import React, { useState, useEffect, useContext } from "react";
import "../../assets/profile-styles/Profile.css";
import maleProfilePic from "../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../assets/view-emp/femaleUserPic.png";
import Axios from "axios";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context";
import EmpSidePanel from "./Employee/EmpSidePanel";
import LoanDetailsCard from "./Admin/LoanDetailsCard";
import { Spring } from "@react-spring/web";

const Profile = () => {
  const [readOnly, setReadOnly] = useState(true);
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    phoneNo: "",
    email: "",
    address: "",
    role: "",
    team: "",
    objective: "",
    skills: "",
    doj: "",
    gender: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [empLoanHistory, setEmpLoanHistory] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("auth-token");
      const userId = localStorage.getItem("userId");
      try {
        const res = await Axios.get("/api/users", {
          headers: { "x-auth-token": token },
        });
        const userSalData = await axios.get(`/api/admin/getUserSalDetails/${userId}`);
        const empLoanHistoryRes = await axios.get(`/api/admin/getEmpLoanHistory/${userId}`);
        setProfile({
          id: res.data.user._id,
          name: res.data.user.name,
          address: res.data.user.address,
          email: res.data.user.email,
          role: res.data.user.role,
          team: res.data.user.team,
          phoneNo: res.data.user.phoneNo,
          objective: res.data.user.objective,
          skills: res.data.user.skills,
          gender: res.data.user.gender,
          doj: res.data.user.doj,
        });
        setEmpLoanHistory(empLoanHistoryRes.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchProfile();
  }, []);

  const onGetDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const updateProfile = async () => {
    if (!readOnly) {
      // Save profile
      try {
        await Axios.post("/api/users/updateProfile", {
          user: profile,
          id: profile.id,
        });
      } catch (e) {
        console.log(e);
      }
    }
    setReadOnly(!readOnly);
  };

  const onChangePassword = async () => {
    const oldPwd = oldPassword.trim();
    const newPwd = newPassword.trim();
    const confirmPwd = confirmPassword.trim();
    const empId = localStorage.getItem("userId");
    if (newPwd !== confirmPwd) {
      setError("new and old password dont match");
    } else {
      try {
        await axios.put(`/api/users/changePassword/${empId}`, {
          oldPassword: oldPwd,
          newPassword: newPwd,
        });
        toast.notify("successfully changed the password", {
          position: "top-right",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (e) {
        setError(e.response?.data?.msg || "Error changing password");
      }
    }
  };

  const onChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
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

  const { name, email, phoneNo, skills, team, role, address, objective, gender, doj } = profile;

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <EmpSidePanel />
          </div>
          {/* right part */}
          <div className="col rightPart" style={props}>
            <div className="row  p-5 ">
              {/* details col */}
              <div className="col detailsCol">
                <h3>User Details</h3>
                <hr />
                <div className="container">
                  <div className="row my-4">
                    <div className="col">
                      <span>Name</span>
                      {!readOnly ? (
                        <input
                          disabled={readOnly}
                          type="text"
                          name="name"
                          value={name}
                          onChange={onChange}
                          className="form-control"
                        />
                      ) : (
                        <h6>{name}</h6>
                      )}
                    </div>
                    <div className="col">
                      <span>Email</span>
                      {!readOnly ? (
                        <input
                          disabled={readOnly}
                          type="email"
                          name="email"
                          value={email}
                          onChange={onChange}
                          className="form-control"
                        />
                      ) : (
                        <h6>{email}</h6>
                      )}
                    </div>
                    <div className="col">
                      <span>Phone No.</span>
                      {!readOnly ? (
                        <input
                          disabled={readOnly}
                          type="number"
                          name="phoneNo"
                          value={phoneNo}
                          onChange={onChange}
                          className="form-control"
                        />
                      ) : (
                        <h6>{phoneNo}</h6>
                      )}
                    </div>
                  </div>
                  <div className="row my-4">
                    <div className="col">
                      <span>Address</span>
                      {!readOnly ? (
                        <input
                          disabled={readOnly}
                          type="text"
                          name="address"
                          value={address}
                          onChange={onChange}
                          className="form-control"
                        />
                      ) : (
                        <h6>{address}</h6>
                      )}
                    </div>
                    <div className="col">
                      <span>Skills</span>
                      {!readOnly ? (
                        <textarea
                          disabled={readOnly}
                          type="text"
                          name="skills"
                          value={skills}
                          onChange={onChange}
                          className="form-control"
                        />
                      ) : (
                        <h6>{skills}</h6>
                      )}
                    </div>
                    <div className="col"></div>
                  </div>
                </div>
                <h3>Company Details</h3>
                <hr />
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <span>Date Of Joining</span>
                      <h6>{doj}</h6>
                    </div>
                    <div className="col">
                      <span>Team</span>
                      <h6>{team}</h6>
                    </div>
                    <div className="col">
                      <span>Role</span>
                      <h6>{role}</h6>
                    </div>
                  </div>
                </div>
              </div>
              {/* profile pic col */}
              <div className="col-3 profilePicCol">
                <div className="row">
                  {gender ? (
                    <img
                      className="userPic"
                      src={gender === "Male" ? maleProfilePic : femaleProfilePic}
                      alt=""
                      width="100px"
                    />
                  ) : null}
                </div>
                <div className="row">
                  <div className="col m-3 objective">
                    {!readOnly ? (
                      <textarea
                        disabled={readOnly}
                        type="text"
                        placeholder="My Objective"
                        value={objective}
                        onChange={onChange}
                        name="objective"
                        className="form-control"
                      />
                    ) : (
                      <h6 className="text-center">
                        <i>{objective}</i>
                      </h6>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col" style={{ display: "flex", justifyContent: "center" }}>
                    <input
                      type="button"
                      value={readOnly ? "Edit Profile" : "Save Profile"}
                      className="btn btn-primary btn-sm"
                      onClick={updateProfile}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {/* change password */}
              <div className="col">
                {/* password form */}
                <div className="container addEmpForm">
                  <h3>Change Password</h3>
                  <hr />
                  {error ? <div className="alert alert-danger">{error}</div> : null}
                  <form onSubmit={e => { e.preventDefault(); onChangePassword(); }}>
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="prevPassword">Enter old password</label>
                          <input
                            required
                            className="form-control"
                            type="password"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="newPassword">Enter new password</label>
                          <input
                            required
                            className="form-control"
                            type="password"
                            name="newPassword"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="confirmPassword">Confirm new password</label>
                          <input
                            required={true}
                            className="form-control"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <input
                          className="btn btn-primary"
                          type="submit"
                          value="Change Password"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* loan history col */}
              <div className="col">
                <div className="container addEmpForm">
                  <h3>Loan History</h3>
                  <hr />
                  {empLoanHistory.length ? (
                    empLoanHistory.map((loan, idx) => (
                      <LoanDetailsCard
                        key={idx}
                        loanDetails={loan}
                        onGetDate={onGetDate}
                        isAdmin={false}
                      />
                    ))
                  ) : (
                    <div>No loan history found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default Profile;
