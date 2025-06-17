import React from "react";

const LoanDetailsCard = ({
  loanDetails,
  onGetDate,
  onMarkAsPaid,
  isAdmin,
}) => {
  const {
    loanRepaid,
    date,
    amount,
    loanNote,
    loanReason,
    modeOfRepayment,
    timePeriod,
  } = loanDetails;

  return (
    <>
      <div className="row">
        <div className="col">
          <h6>Date:</h6>
        </div>
        <div className="col">
          <h6>{onGetDate(date)}</h6>
        </div>
      </div>
      <div className="row">
          <div className="col">
            <h6>Amount: </h6>
          </div>
          <div className="col">
            <h6>₹{amount}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Subject: </h6>
          </div>
          <div className="col">
            <h6>{loanReason}</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Time Period: </h6>
          </div>
          <div className="col">
            <h6>{timePeriod} months</h6>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Mode Of Repayment: </h6>
          </div>
          <div className="col">
            <h6>{modeOfRepayment}</h6>
          </div>
        </div>

      <div className="row">
        <div className="col">
          <h6>Loan note:</h6>
        </div>
        <div className="col">
          <div className="jumbotron mx-0 my-2 p-3">{loanNote}</div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          {isAdmin ? (
            loanRepaid ? (
              <input type="button" disabled value="Paid" className="btn btn-success btn-block" />
            ) : (
              <input type="button" onClick={() => onMarkAsPaid(loanDetails)} value="Mark As Paid" className="btn btn-primary btn-block" />
            )
          ) : loanRepaid ? (
            <input type="button" disabled value="Paid" className="btn btn-success btn-block" />
          ) : (
            <input type="button" disabled value="Pending" className="btn btn-primary btn-block" />
          )}
        </div>
      </div>

      <hr style={{ border: "dashed grey 1px" }} />
    </>
  );
};

export default LoanDetailsCard;
