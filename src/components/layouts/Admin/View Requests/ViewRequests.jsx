import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../../../context";
import AdminSidePanel from "../AdminSidePanel";
import BonusRequestCard from "./BonusRequestCard";
import LeaveRequestCard from "./LeaveRequestCard";
import LoanRequestCard from "./LoanRequestCard";
import classNames from "classnames";
import { useSpring, animated } from "react-spring";

const ViewRequests = () => {
  const { user, dispatch } = useContext(Context);

  const [admin, setAdmin] = useState(undefined);
  const [expandLeaveReq, setExpandLeaveReq] = useState(true);
  const [expandBonusReq, setExpandBonusReq] = useState(false);
  const [expandLoanReq, setExpandLoanReq] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const tokenRes = await axios.post("/api/admin/tokenIsValid", null, {
          headers: { "x-auth-token": token },
        });

        if (tokenRes.data) {
          const adminRes = await axios.get("/api/admin", {
            headers: { "x-auth-token": token },
          });
          setAdmin(adminRes.data.user);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchAdmin();
  }, []);

  const callDispatch = (req) => {
    const updatedAdmin = { ...admin };

    if (req.title === "leave request") {
      updatedAdmin.leaveRequests = updatedAdmin.leaveRequests.filter(
        (r) => r.reqId !== req.reqId
      );
      dispatch({ type: "APPROVED_REJECTED_LEAVE", payload: { reqId: req.reqId } });
    } else if (req.title === "bonus request") {
      updatedAdmin.bonusRequests = updatedAdmin.bonusRequests.filter(
        (r) => r.reqId !== req.reqId
      );
      dispatch({ type: "APPROVED_REJECTED_BONUS", payload: { reqId: req.reqId } });
    } else if (req.title === "loan request") {
      updatedAdmin.loanRequests = updatedAdmin.loanRequests.filter(
        (r) => r.reqId !== req.reqId
      );
      dispatch({ type: "APPROVED_REJECTED_LOAN", payload: { reqId: req.reqId } });
    }

    setAdmin(updatedAdmin);
  };

  const onApprove = async (req) => {
    callDispatch(req);
    req.approved = true;
    req.ticketClosed = true;

    try {
      const adminId = localStorage.getItem("userId");
      await axios.put("/api/admin/takeAction", {
        userReq: req,
        adminId,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onReject = async (req) => {
    callDispatch(req);
    req.approved = false;
    req.ticketClosed = true;

    try {
      const adminId = localStorage.getItem("userId");
      await axios.put("/api/admin/takeAction", {
        userReq: req,
        adminId,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const token = localStorage.getItem("auth-token");
  if (!token) return <Navigate to="/login" replace />;
  if (user && user.role !== "admin") return <Navigate to="/empDashBoard" replace />;

  const props = useSpring({ from: { opacity: 0 }, to: { opacity: 1 }, config: { duration: 300 } });

  return (
    <animated.div style={props}>
      <div className="row m-0">
        <div className="col-2 p-0 leftPart">
          <AdminSidePanel />
        </div>
        <div className="col">
          <div className="container py-3">
            {/* Leave Requests */}
            <h3>
              Leave Requests{" "}
              <span className="badge badge-pill badge-dark" style={{ fontSize: "15px" }}>
                {admin?.leaveRequests?.length || 0}
              </span>{" "}
              <i
                style={{ cursor: "pointer" }}
                onClick={() => setExpandLeaveReq(!expandLeaveReq)}
                className={classNames("fa", {
                  "fa-caret-down": !expandLeaveReq,
                  "fa-caret-up": expandLeaveReq,
                })}
              ></i>
            </h3>

            {expandLeaveReq && (
              <div className="row">
                {admin?.leaveRequests?.length ? (
                  admin.leaveRequests.map((req, index) => (
                    <LeaveRequestCard
                      key={index}
                      req={req}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))
                ) : (
                  <small className="ml-4">No leave requests pending...</small>
                )}
              </div>
            )}
            <hr />

            {/* Bonus Requests */}
            <h3>
              Bonus Requests{" "}
              <span className="badge badge-pill badge-dark" style={{ fontSize: "15px" }}>
                {admin?.bonusRequests?.length || 0}
              </span>{" "}
              <i
                style={{ cursor: "pointer" }}
                onClick={() => setExpandBonusReq(!expandBonusReq)}
                className={classNames("fa", {
                  "fa-caret-down": !expandBonusReq,
                  "fa-caret-up": expandBonusReq,
                })}
              ></i>
            </h3>

            {expandBonusReq && (
              <div className="row">
                {admin?.bonusRequests?.length ? (
                  admin.bonusRequests.map((req, index) => (
                    <BonusRequestCard
                      key={index}
                      req={req}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))
                ) : (
                  <small className="ml-4">No bonus requests pending...</small>
                )}
              </div>
            )}
            <hr />

            {/* Loan Requests */}
            <h3>
              Loan Requests{" "}
              <span className="badge badge-pill badge-dark" style={{ fontSize: "15px" }}>
                {admin?.loanRequests?.length || 0}
              </span>{" "}
              <i
                style={{ cursor: "pointer" }}
                onClick={() => setExpandLoanReq(!expandLoanReq)}
                className={classNames("fa", {
                  "fa-caret-down": !expandLoanReq,
                  "fa-caret-up": expandLoanReq,
                })}
              ></i>
            </h3>

            {expandLoanReq && (
              <div className="row">
                {admin?.loanRequests?.length ? (
                  admin.loanRequests.map((req, index) => (
                    <LoanRequestCard
                      key={index}
                      req={req}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  ))
                ) : (
                  <small className="ml-4">No loan requests pending...</small>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default ViewRequests;
