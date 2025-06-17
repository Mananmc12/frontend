import React from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";
import { Context } from "../../../../context";
import { Link } from "react-router-dom";
import axios from "axios";
import { Tooltip } from "react-tooltip";

const LoanRequestCard = ({ req, onApprove, onReject }) => {
  const { dispatch } = React.useContext(Context);

  const downloadAttachment = async (attachmentName) => {
    try {
      const response = await axios({
        url: `/api/users/download/${attachmentName}`,
        method: "POST",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachmentName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const {
    empId,
    empName,
    loanNote,
    empEmail,
    gender,
    empRole,
    empTeam,
    amount,
    loanReason,
    modeOfRepayment,
    timePeriod,
    attachmentName,
  } = req;

  return (
    <div className="leaveReqCard">
      <Link
        to={`/editEmpProfile/${empId}`}
        style={{ textDecoration: "none", color: "#303030" }}
      >
        <div className="row">
          <div className="col">
            <img
              src={gender === "Male" ? maleProfilePic : femaleProfilePic}
              alt="profile pic"
              width="100px"
            />
          </div>
          <div className="col text-right">
            <h4>{empName}</h4>
            <h6>{empEmail}</h6>
          </div>
        </div>
      </Link>
      <hr className="m-0 my-3" />

      <div className="row">
        <div className="col pr-0">
          <h6>Team: </h6>
        </div>
        <div className="col pl-0 text-right">
          <h6>{empTeam}</h6>
        </div>
      </div>

      <div className="row">
        <div className="col pr-0">
          <h6>Role: </h6>
        </div>
        <div className="col pl-0 text-right">
          <h6>{empRole}</h6>
        </div>
      </div>

      <div className="row">
        <div className="col pr-0">
          <h6>Loan Amount: </h6>
        </div>
        <div className="col pl-0 text-right">
          <h6>₹{amount}</h6>
        </div>
      </div>

      <div className="row">
        <div className="col pr-0">
          <h6>Subject: </h6>
        </div>
        <div className="col pl-0 text-right">
          <h6>{loanReason}</h6>
        </div>
      </div>

      <div className="row">
        <div className="col pr-0">
          <h6>Time Period: </h6>
        </div>
        <div className="col pl-0 text-right">
          <h6>{timePeriod} months</h6>
        </div>
      </div>

      <div className="row">
        <div className="col pr-0">
          <h6>Mode Of Repayment: </h6>
        </div>
        <div className="col pl-0 text-right">
          <h6>{modeOfRepayment}</h6>
        </div>
      </div>

      <div className="row ">
        <div className="col">
          <h6>
            Note:{" "}
            {attachmentName && (
              <>
                <Tooltip place="bottom" delayShow={100} html={true} />
                <i
                  onClick={() => downloadAttachment(attachmentName)}
                  data-tip={attachmentName.slice(13)}
                  className="fa fa-paperclip mb-2"
                  style={{ fontSize: "18px", cursor: "pointer" }}
                >
                  <small> {attachmentName.slice(13)}</small>
                </i>
              </>
            )}
          </h6>
          <div className="reasonContainer">{loanNote}</div>
        </div>
      </div>

      <div className="row">
        <div className="col d-flex justify-content-center">
          <input
            type="button"
            className="btn btn-success btn-block"
            value="Accept"
            onClick={() => onApprove(req, dispatch)}
          />
        </div>

        <div className="col d-flex justify-content-center">
          <input
            type="button"
            className="btn btn-danger btn-block"
            value="Reject"
            onClick={() => onReject(req, dispatch)}
          />
        </div>
      </div>
    </div>
  );
};

export default LoanRequestCard;
