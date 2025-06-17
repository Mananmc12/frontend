import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidePanel from "./AdminSidePanel";
import { Context } from "../../../context";

const Options = () => {
  const [teamName, setTeamName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [existingTeamList, setExistingTeamList] = useState([]);
  const [existingRoleList, setExistingRoleList] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [time, setTime] = useState("");

  const { dispatch, user } = useContext(Context);
  const navigate = useNavigate();

  const animationProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 300 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamList = await axios.get("/api/admin/getTeamsAndRoles");
        setExistingTeamList(teamList.data[0].teamNames);
        setExistingRoleList(teamList.data[0].roleNames);
      } catch (error) {
        console.error("Error fetching teams/roles:", error);
      }
    };
    fetchData();
  }, []);

  const onAddTeam = async () => {
    if (teamName.trim().length === 0) {
      setError("Team name cannot be empty");
    } else if (existingTeamList.includes(teamName.trim())) {
      setError("Team name already exists");
    } else {
      try {
        const res = await axios.post("/api/admin/addNewTeam", { teamName });
        setExistingTeamList(res.data.teamNames);
        toast.success("New team added successfully");
        setTeamName("");
        setError("");
      } catch (err) {
        console.error("Failed to add team", err);
      }
    }
  };

  const onAddRole = async () => {
    if (roleName.trim().length === 0) {
      setError("Role name cannot be empty");
    } else if (existingRoleList.includes(roleName.trim())) {
      setError("Role name already exists");
    } else {
      try {
        const res = await axios.post("/api/admin/addNewRole", { roleName });
        setExistingRoleList(res.data.roleNames);
        toast.success("New role added successfully");
        setRoleName("");
        setError("");
      } catch (err) {
        console.error("Failed to add role", err);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const adminId = localStorage.getItem("userId");
    try {
      await axios.delete(`/api/admin/deleteAdminAcc/${adminId}`);
      localStorage.clear();
      dispatch({ type: "LOGGED_OUT" });
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const addToGoogleCalendar = async (e) => {
    e.preventDefault();
    try {
      const gapi = window.gapi;

      const CLIENT_ID = "487679379915-7rvf2ror46e4bbsj8t8obali4heq5qjm.apps.googleusercontent.com";
      const API_KEY = "AIzaSyB_HYziuQ7j6s9CiqSgXV3YiGTzr5nc0xE";
      const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
      const SCOPES = "https://www.googleapis.com/auth/calendar.events";

      gapi.load("client:auth2", () => {
        gapi.client.init({ apiKey: API_KEY, clientId: CLIENT_ID, discoveryDocs: DISCOVERY_DOCS, scope: SCOPES });

        gapi.client.load("calendar", "v3");

        gapi.auth2.getAuthInstance().signIn().then(() => {
          const event = {
            summary: title,
            description,
            start: {
              dateTime: `${dueDate}T${time}:00`,
              timeZone: "Asia/Kolkata",
            },
            end: {
              dateTime: `${dueDate}T${time}:00`,
              timeZone: "Asia/Kolkata",
            },
            reminders: {
              useDefault: false,
              overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
              ],
            },
          };

          gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          }).execute(() => {
            toast.success("Successfully set reminder in Google Calendar");
          });
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const token = localStorage.getItem("auth-token");
  if (!token) {
    navigate("/login");
    return null;
  }
  if (user && user.role !== "admin") {
    navigate("/empDashBoard");
    return null;
  }

  return (
    <animated.div style={animationProps} className="row m-0">
      {/* Left panel */}
      <div className="col-2 p-0 leftPart">
        <AdminSidePanel />
      </div>

      {/* Right panel */}
      <div className="col rightPart container">
        <div className="row">
          {/* Team and Role Section */}
          <div className="col">
            <form className="addEmpForm">
              {error && <div className="alert alert-danger">{error}</div>}
              <h3>Add new Teams and Roles</h3>
              <hr />

              <label>New Team</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={onAddTeam}
                  >
                    Add
                  </button>
                </div>
              </div>

              <label>New Role</label>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={onAddRole}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>

            <div className="row mt-5 ml-3">
              <div className="col">
                <input
                  type="button"
                  className="btn btn-danger"
                  value="Delete Admin Account"
                  onClick={handleDeleteAccount}
                />
                <div className="alert alert-danger mt-3">
                  <small>
                    <b>Note:</b> By deleting admin account, you
                                will loose all your current pending requests,
                                which might lead to adverse effects. Therefore
                                it is recommended you delete the account once
                                clearing all the requests
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Google Calendar Section */}
          <div className="col">
            <form onSubmit={addToGoogleCalendar} className="addEmpForm">
              <h3>Add Reminder <i className="fab fa-google text-dark"></i></h3>
              <hr />

              <div className="form-group">
                <label>Title</label>
                <input
                  required
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  required
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="row">
                <div className="col form-group">
                  <label>Due Date</label>
                  <input
                    required
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="col form-group">
                  <label>Time</label>
                  <input
                    required
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <input type="submit" value="Submit" className="btn btn-primary btn-block" />
            </form>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Options;
