import axios from "axios";
import React from "react";
import { Spring } from "@react-spring/web";

const BonusRequestTemplate = ({ reqDetails }) => {
  const onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  const downloadAttachment = async (attachmentName) => {
    axios({
      url: `/api/users/download/${attachmentName}`,
      method: "POST",
      responseType: "blob", // important
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
    date,
    reqId,
    empEmail,
    empName,
    bonusNote,
    bonusReason,
    ticketClosed,
    approved,
    attachmentName,
  } = reqDetails;

  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div className="mySingleReqCard m-5" style={props}>
          <div className="row">
            {/* subject */}
            <div className="col">
              <h2>{bonusReason}</h2>
            </div>
            {/* GUI Progress */}
            <div className="col mt-3">
              <i className="fas fa-check-circle text-success"></i>
              <strong> Opened </strong>- - - - - -{"  "}
              <i className="fas fa-check-circle text-success"></i>
              <strong> Assigned </strong> - - - - - -{" "}
              {ticketClosed ? (
                <>
                  <i className="fas fa-check-circle text-success"></i>{" "}
                  <strong> Resolved </strong>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>{" "}
                  <strong> Resolved</strong>
                </>
              )}
            </div>
          </div>
          <hr />

          <div className="row">
            {/* first col */}
            <div className="col">
              <div className="row">
                <div className="col">
                  <small>Request ID:</small>
                  <h6>{reqId}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <small>Created On:</small>
                  <h6>{onGetDate(date)}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <small>Status</small>
                  {ticketClosed ? <h6>Closed</h6> : <h6>Pending</h6>}
                </div>

                <div className="col">
                  <small>Approved/Rejected</small>
                  {ticketClosed ? (
                    approved ? (
                      <h6>Approved</h6>
                    ) : (
                      <h6 className="text-danger">Rejected</h6>
                    )
                  ) : (
                    <h6>NA</h6>
                  )}
                </div>
              </div>
            </div>

            {/* second col */}
            <div className="col">
              <div className="row">
                <div className="col">
                  <small>Raised By:</small>
                  <h6>{empName}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <small>Employee Email:</small>
                  <h6>{empEmail}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <small>Request:</small>
                  <div className="reasonArea">
                    <h6>{bonusNote}</h6>
                  </div>
                </div>
              </div>

              {attachmentName ? (
                <div className="row mt-4">
                  <div className="col">
                    <h6
                      style={{ cursor: "pointer" }}
                      onClick={() => downloadAttachment(attachmentName)}
                    >
                      <i
                        className="fa fa-paperclip mb-2"
                        style={{ fontSize: "22px" }}
                      ></i>{" "}
                      {attachmentName.slice(13)}
                    </h6>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default BonusRequestTemplate;
