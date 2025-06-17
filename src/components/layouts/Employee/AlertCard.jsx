import React from "react";
import classNames from "classnames";
import { Tooltip } from "react-tooltip";

const AlertCard = ({ data, onDeleteAlert }) => {
  const onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  const { approved, createdOn, reason, subject, reqId } = data;

  return (
    <div
      className={classNames("alert alert-dismissible fade show", {
        "alert-success": approved,
        "alert-danger": !approved,
      })}
      role="alert"
    >
      {approved ? (
        <small>Request Approved</small>
      ) : (
        <small>Request Rejected</small>
      )}

      <Tooltip place="bottom" delayShow={100} html={true} />
      <h6>
        {subject}{" "}
        <i
          className="fas fa-info-circle text-secondary"
          data-tip={`Reason<br /> ${reason}, <br /><br /> Created On<br /> ${onGetDate(
            createdOn
          )}`}
        ></i>
      </h6>

      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={() => onDeleteAlert(reqId)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default AlertCard;
