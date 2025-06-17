import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spring } from "@react-spring/web";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import { Context } from "../../context";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    phoneNo: "",
    role: "Select Role",
    team: "Select Team",
    gender: "Select Value",
    doj: "",
    disabled: false,
    error: "",
    teamList: [],
    roleList: [],
  });

  const { user, token } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamAndRoleList = async () => {
      const teamAndRoleList = await axios.get("/api/admin/getTeamsAndRoles");
      setFormData(prev => ({
        ...prev,
        teamList: teamAndRoleList.data[0].teamNames,
        roleList: teamAndRoleList.data[0].roleNames,
      }));
    };
    fetchTeamAndRoleList();
  }, []);

  const onSelectGender = (gender) => setFormData(prev => ({ ...prev, gender }));
  const onTeamSelect = (team) => setFormData(prev => ({ ...prev, team }));
  const onRoleSelect = (role) => setFormData(prev => ({ ...prev, role }));

  const onSubmit = async (e) => {
    e.preventDefault();

    // disable signup btn
    setFormData(prev => ({ ...prev, disabled: true }));

    const {
      email,
      name,
      address,
      phoneNo,
      role,
      team,
      doj,
      gender,
    } = formData;

    try {
      const newUser = await axios.post("/api/admin/addEmployee", {
        email,
        name,
        address,
        gender,
        phoneNo,
        role,
        team,
        doj,
      });

      toast.notify("Added new employee", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      navigate(`/editEmpProfile/${newUser.data._id}`);
    } catch (err) {
      // enable signup btn
      setFormData(prev => ({ 
        ...prev, 
        disabled: false,
        error: err.response.data.msg 
      }));
      console.log("ERROR: ", err.response.data.msg);
    }
  };

  const onChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  if (!token) {
    navigate("/login");
    return null;
  }

  if (user && user.role !== "admin") {
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
        <>
          <div className="row m-0">
            {/* left part */}
            <div className="col-2  p-0 leftPart">
              <AdminSidePanel />
            </div>

            {/* right part */}
            <div
              className="col"
              style={{
                display: "flex ",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <div style={props}>
                {formData.error ? (
                  <div className="alert alert-danger my-3">
                    {formData.error}
                  </div>
                ) : null}

                <form
                  className="addEmpForm"
                  onSubmit={onSubmit}
                >
                  <h3 className="">ADD EMPLOYEE</h3>
                  <hr />

                  <div className="row">
                    <div className="col">
                      {/* name */}
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Joey Tribbiani"
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="col">
                      {/* email */}
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control mb-3 "
                        placeholder="joey@gmail.com"
                        onChange={onChange}
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
                        id="address"
                        rows="1"
                        className="form-control mb-3 "
                        placeholder="Mapusa, Goa"
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="col">
                      {/* phone no */}
                      <label htmlFor="phoneNo">Phone No.</label>
                      <input
                        type="number"
                        name="phoneNo"
                        className="form-control mb-3 "
                        placeholder="1234567890"
                        onChange={onChange}
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
                          {formData.team}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {formData.teamList.map((teamName) => (
                            <li
                              style={{ cursor: "pointer" }}
                              key={teamName}
                              className="dropdown-item"
                              onClick={() => onTeamSelect(teamName)}
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
                          {formData.role}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {formData.roleList.map((roleName) => (
                            <li
                              style={{ cursor: "pointer" }}
                              key={roleName}
                              className="dropdown-item"
                              onClick={() => onRoleSelect(roleName)}
                            >
                              {roleName}
                            </li>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* gender */}
                    <div className="col">
                      <label htmlFor="gender">Gender</label>
                      <div className="dropdown">
                        <button
                          className="btn btn-light dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {formData.gender}
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <li
                            style={{ cursor: "pointer" }}
                            className="dropdown-item"
                            onClick={() => onSelectGender("Male")}
                          >
                            Male
                          </li>
                          <li
                            style={{ cursor: "pointer" }}
                            className="dropdown-item"
                            onClick={() => onSelectGender("Female")}
                          >
                            Female
                          </li>
                        </div>
                      </div>
                    </div>

                    {/* doj */}
                    <div className="col">
                      <label htmlFor="doj">Date Of Joining</label>
                      <input
                        type="date"
                        name="doj"
                        className="form-control mb-3"
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formData.disabled}
                  >
                    Add Employee
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </Spring>
  );
};

export default AddEmployee;
