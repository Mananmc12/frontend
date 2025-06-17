import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";
import empty from "../../../assets/images/empty.png";
import { Spring } from "@react-spring/web";
import { Tooltip } from "react-tooltip";

const MyRequests = () => {
  const [user, setUser] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [openedLeavesTickets, setOpenedLeavesTickets] = useState([]);
  const [closedLeavesTickets, setClosedLeavesTickets] = useState([]);
  const [loanRequests, setLoanRequests] = useState([]);
  const [openedLoanTickets, setOpenedLoanTickets] = useState([]);
  const [closedLoanTickets, setClosedLoanTickets] = useState([]);
  const [bonusRequests, setBonusRequests] = useState([]);
  const [openedBonusTickets, setOpenedBonusTickets] = useState([]);
  const [closedBonusTickets, setClosedBonusTickets] = useState([]);
  const [listToShow, setListToShow] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("Leave Requests");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { user: contextUser } = useContext(Context);
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");

  const onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userRes = await axios.get("/api/users", {
        headers: { "x-auth-token": token },
      });
      setUser(userRes.data.user);
      filterLists(userRes.data.user);
    };
    fetchUser();
  }, [token]);

  const filterLists = (userData) => {
    let leaveRequests = [];
    let openedLeavesTickets = [];
    let closedLeavesTickets = [];
    let loanRequests = [];
    let openedLoanTickets = [];
    let closedLoanTickets = [];
    let bonusRequests = [];
    let openedBonusTickets = [];
    let closedBonusTickets = [];

    userData.notification.forEach((item) => {
      if (item.title === "leave request") {
        leaveRequests.push(item);
        if (item.ticketClosed) closedLeavesTickets.push(item);
        else openedLeavesTickets.push(item);
      } else if (item.title === "loan request") {
        loanRequests.push(item);
        if (item.ticketClosed) closedLoanTickets.push(item);
        else openedLoanTickets.push(item);
      } else {
        bonusRequests.push(item);
        if (item.ticketClosed) closedBonusTickets.push(item);
        else openedBonusTickets.push(item);
      }
    });

    leaveRequests = leaveRequests.reverse();
    loanRequests = loanRequests.reverse();
    bonusRequests = bonusRequests.reverse();
    openedLeavesTickets = openedLeavesTickets.reverse();
    closedLeavesTickets = closedLeavesTickets.reverse();
    openedBonusTickets = openedBonusTickets.reverse();
    closedBonusTickets = closedBonusTickets.reverse();
    openedLoanTickets = openedLoanTickets.reverse();
    closedLoanTickets = closedLoanTickets.reverse();

    setLeaveRequests(leaveRequests);
    setLoanRequests(loanRequests);
    setBonusRequests(bonusRequests);
    setOpenedLeavesTickets(openedLeavesTickets);
    setClosedLeavesTickets(closedLeavesTickets);
    setOpenedBonusTickets(openedBonusTickets);
    setClosedBonusTickets(closedBonusTickets);
    setOpenedLoanTickets(openedLoanTickets);
    setClosedLoanTickets(closedLoanTickets);
    setListToShow(leaveRequests);
  };

  const onSelectLabel = (selectedLabel) => {
    setSelectedLabel(selectedLabel);
    onSelectFilter(selectedFilter);
  };

  const onSelectFilter = (selectedFilter) => {
    let listToShow = [];
    if (selectedLabel === "Leave Requests") {
      if (selectedFilter === "All") {
        listToShow = leaveRequests;
      } else if (selectedFilter === "Pending") {
        listToShow = openedLeavesTickets;
      } else {
        listToShow = closedLeavesTickets;
      }
    } else if (selectedLabel === "Bonus Requests") {
      if (selectedFilter === "All") {
        listToShow = bonusRequests;
      } else if (selectedFilter === "Pending") {
        listToShow = openedBonusTickets;
      } else {
        listToShow = closedBonusTickets;
      }
    } else {
      if (selectedFilter === "All") {
        listToShow = loanRequests;
      } else if (selectedFilter === "Pending") {
        listToShow = openedLoanTickets;
      } else {
        listToShow = closedLoanTickets;
      }
    }
    setSelectedFilter(selectedFilter);
    setListToShow(listToShow);
  };

  if (!token) {
    navigate("/login");
    return null;
  }
  if (contextUser && contextUser.role === "admin") {
    navigate("/");
    return null;
  }

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
            <div className="container pl-5 pt-3">
              <div className="row">
                <div className="col">
                  <h2>My Requests</h2>
                </div>
                <div className="col text-right">
                  {/* choose buttons */}
                  <div className="row">
                    <div className="col">
                      <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className="btn btn-primary active">
                          <input
                            type="radio"
                            name="options"
                            id="option1"
                            autoComplete="off"
                            checked={selectedLabel === "Leave Requests"}
                            onChange={() => onSelectLabel("Leave Requests")}
                          />
                          Leave Requests
                        </label>
                        <label className="btn btn-primary">
                          <input
                            type="radio"
                            name="options"
                            id="option2"
                            autoComplete="off"
                            checked={selectedLabel === "Bonus Requests"}
                            onChange={() => onSelectLabel("Bonus Requests")}
                          />
                          Bonus Requests
                        </label>
                        <label className="btn btn-primary">
                          <input
                            type="radio"
                            name="options"
                            id="option3"
                            autoComplete="off"
                            checked={selectedLabel === "Loan Requests"}
                            onChange={() => onSelectLabel("Loan Requests")}
                          />
                          Loan Requests
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-secondary active">
                      <input
                        type="radio"
                        name="options"
                        id="option1"
                        autoComplete="off"
                        checked={selectedFilter === "All"}
                        onChange={() => onSelectFilter("All")}
                      />
                      All
                    </label>
                    <label className="btn btn-secondary">
                      <input
                        type="radio"
                        name="options"
                        id="option2"
                        autoComplete="off"
                        checked={selectedFilter === "Pending"}
                        onChange={() => onSelectFilter("Pending")}
                      />
                      Pending
                    </label>
                    <label className="btn btn-secondary">
                      <input
                        type="radio"
                        name="options"
                        id="option3"
                        autoComplete="off"
                        checked={selectedFilter === "Closed"}
                        onChange={() => onSelectFilter("Closed")}
                      />
                      Closed
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col">
                  {listToShow.length ? (
                    <div className="list-group">
                      {listToShow.map((item, index) => (
                        <div key={index} className="list-group-item">
                          <div className="row">
                            <div className="col">
                              <h5>{item.title}</h5>
                              <p>{item.message}</p>
                              <p>
                                <small>
                                  <i className="fas fa-calendar-alt"> {onGetDate(item.date)}</i>
                                </small>
                              </p>
                            </div>
                            <div className="col-auto">
                              {item.ticketClosed ? (
                                <span className="badge badge-success">Closed</span>
                              ) : (
                                <span className="badge badge-warning">Pending</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <img src={empty} alt="" height="200px" className="mt-5" />
                      <h1 className="mt-4">No Requests found...</h1>
                    </div>
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

export default MyRequests;
