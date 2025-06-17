import React from "react";
import "../../../../assets/view-req/leaveReqCard.css";
import maleProfilePic from "../../../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../../../assets/view-emp/femaleUserPic.png";
import { Context } from "../../../../context";
import { Link } from "react-router-dom";
import axios from "axios";
import { Tooltip } from "react-tooltip";

const LeaveRequestCard = ({ req, onApprove, onReject }) => {
  const downloadAttachment = async (attachmentName) => {
    axios({
      url: `/api/users/download/${attachmentName}`,
      method: "POST",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", attachmentName);
      document.body.appendChild(link);
      link.click();
    });
  };

  const {
    empId,
    empName,
    reason,
    empTeam,
    empRole,
    fromDate,
    toDate,
    empEmail,
    gender,
    subject,
    attachmentName,
  } = req;

  return (
    <Context.Consumer>
      {({ dispatch }) => (
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
          <hr className="mt-2" />

          <div className="row">
            <div className="col">
              <h6>Team:</h6>
            </div>
            <div className="col text-right">
              <h6>{empTeam}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h6>Role:</h6>
            </div>
            <div className="col text-right">
              <h6>{empRole}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h6>From:</h6>
            </div>
            <div className="col text-right">
              <h6>{fromDate}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h6>To:</h6>
            </div>
            <div className="col text-right">
              <h6>{toDate}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h6>
                Reason:{" "}
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
              <div className="reasonContainer">
                <b>{subject}</b>
                <br />
                {reason}
              </div>
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
      )}
    </Context.Consumer>
  );
};

export default LeaveRequestCard;
