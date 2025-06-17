import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";
import LeaveRequestTemplate from "./LeaveRequestTemplate";
import BonusRequestTemplate from "./BonusRequestTemplate";
import LoanRequestTemplate from "./LoanRequestTemplate";
import "../../../assets/view-single-req/viewSingleReq.css";

const ViewSingleRequest = () => {
  const [reqDetails, setReqDetails] = useState({});
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const { reqId } = useParams();

  useEffect(() => {
    const fetchReqDetails = async () => {
      const userId = localStorage.getItem("userId");
      const reqDetailsRes = await axios.get(
        `/api/users/getSingleReqDetails/${userId}/${reqId}`
      );
      setReqDetails(reqDetailsRes.data[0]);
    };
    fetchReqDetails();
  }, [reqId]);

  const token = localStorage.getItem("auth-token");
  if (!token) {
    navigate("/");
    return null;
  }

  const { title } = reqDetails;

  return (
    <div className="row m-0">
      {/* left part */}
      <div className="col-2 p-0 leftPart">
        <EmpSidePanel />
      </div>
      {/* right part */}
      <div className="col rightPart">
        {title === "leave request" ? (
          <LeaveRequestTemplate reqDetails={reqDetails} />
        ) : null}
        {title === "bonus request" ? (
          <BonusRequestTemplate reqDetails={reqDetails} />
        ) : null}
        {title === "loan request" ? (
          <LoanRequestTemplate reqDetails={reqDetails} />
        ) : null}
      </div>
    </div>
  );
};

export default ViewSingleRequest;
