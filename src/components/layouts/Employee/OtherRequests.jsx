import axios from "axios";
import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import classNames from "classnames";
import { Spring } from "@react-spring/web";
import { Context } from "../../../context";

const OtherRequests = () => {
  const [formData, setFormData] = useState({
    // loan related
    loanReason: "Medical Expenditure",
    otherLoanReason: "",
    loanNote: "",
    ModeOfRepayment: "Deduction from salary",
    amount: "",
    timePeriod: "",

    // bonus related
    bonusReason: "Employee Referral Program",
    otherBonusReason: "",
    bonusNote: "",

    // file
    attachLoanFile: false,
    attachBonusFile: false,
    attachmentName: "",
    file: "",
  });

  const { user } = useContext(Context);
  const navigate = useNavigate();
  const fileInput = useRef(null);

  const onChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onUploadFile = async () => {
    // upload file if selected
    if (formData.file) {
      const data = new FormData();
      data.append("file", formData.file);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      try {
        const fileUploadRes = await axios.post(
          "/api/users/uploadfile",
          data,
          config
        );

        console.log(fileUploadRes.data.filename);

        setFormData(prev => ({ ...prev, attachmentName: fileUploadRes.data.filename }));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onBonusSubmit = async (e) => {
    e.preventDefault();

    await onUploadFile();

    let bonusReason = formData.otherBonusReason
      ? formData.otherBonusReason
      : formData.bonusReason;

    const request = {
      title: "bonus request",
      reqId: uuidv4(),
      empId: user._id,
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      date: new Date(),
      empTeam: user.team,
      empEmail: user.email,
      bonusNote: formData.bonusNote,
      attachmentName: formData.attachmentName,
      bonusReason,
      approved: false,
      ticketClosed: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/bonusRequest", {
      request,
    });

    toast.notify("Successfully submitted bonus request", {
      position: "top-right",
    });

    navigate("/myRequests");

    console.log("res: ", res.data);
  };

  const onLoanSubmit = async (e) => {
    e.preventDefault();

    await onUploadFile();

    let loanReason = formData.otherLoanReason
      ? formData.otherLoanReason
      : formData.loanReason;

    const request = {
      title: "loan request",
      reqId: uuidv4(),
      empId: user._id,
      date: new Date(),
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      empTeam: user.team,
      empEmail: user.email,
      loanNote: formData.loanNote,
      amount: formData.amount,
      loanReason,
      attachmentName: formData.attachmentName,
      modeOfRepayment: formData.ModeOfRepayment,
      timePeriod: formData.timePeriod,
      approved: false,
      ticketClosed: false,
      loanRepaid: false,
    };

    // push to admin notification
    const res = await axios.put("/api/users/loanRequest", {
      request,
    });

    toast.notify("Successfully submitted loan request", {
      position: "top-right",
    });

    navigate("/myRequests");
    console.log("successfully submitted req: ", res.data);
  };

  const onReasonSelect = (loanReason) =>
    setFormData(prev => ({ ...prev, loanReason, otherLoanReason: "" }));

  const onModeOfRepaymentSelect = (ModeOfRepayment) =>
    setFormData(prev => ({ ...prev, ModeOfRepayment }));

  const onBonusReasonSelect = (bonusReason) => 
    setFormData(prev => ({ ...prev, bonusReason }));

  const onFileChange = (e) => {
    try {
      console.log(e.target.files[0]);
      setFormData(prev => ({
        ...prev,
        file: e.target.files[0],
        attachmentName: e.target.files[0].name,
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const clearFile = (e) => {
    e.preventDefault();
    console.log("clearing...");
    if (fileInput.current) fileInput.current.value = "";
    setFormData(prev => ({ ...prev, file: "", attachmentName: "" }));
  };

  const token = localStorage.getItem("auth-token");
  if (!token) {
    navigate("/login");
    return null;
  }

  if (user && user.role === "admin") {
    navigate("/");
    return null;
  }

  return (
    <Spring
      from={{
        transform: "translate3d(0,-1000px,0) ",
      }}
      to={{
        transform: "translate3d(0px,0,0) ",
      }}
      config={{ friction: 20 }}
    >
      {(props) => (
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <EmpSidePanel />
          </div>

          {/* right part */}
          <div className="col rightPart container" style={props}>
            <div className="row">
              {/* loan col */}
              <div className="col ml-5">
                <form
                  className="addEmpForm"
                  onSubmit={onLoanSubmit}
                >
                  <h2>Request for Loan</h2>
                  <hr />

                  <div className="row">
                    {/* reason dropdown */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="loanReason">Loan Reason</label>
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {formData.loanReason}
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onReasonSelect("Medical Expenditure")}
                            >
                              Medical Expenditure
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onReasonSelect("Education")}
                            >
                              Education
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onReasonSelect("Marriage")}
                            >
                              Marriage
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onReasonSelect("Other")}
                            >
                              Other
                            </li>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* other reason */}
                    {formData.loanReason === "Other" ? (
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="otherLoanReason">Other Reason</label>
                          <input
                            type="text"
                            name="otherLoanReason"
                            className="form-control"
                            id="otherLoanReason"
                            value={formData.otherLoanReason}
                            onChange={onChange}
                            required
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="row">
                    {/* amount */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                          type="number"
                          name="amount"
                          className="form-control"
                          id="amount"
                          value={formData.amount}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>

                    {/* time period */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="timePeriod">Time Period (in months)</label>
                        <input
                          type="number"
                          name="timePeriod"
                          className="form-control"
                          id="timePeriod"
                          value={formData.timePeriod}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* mode of repayment */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="ModeOfRepayment">Mode Of Repayment</label>
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {formData.ModeOfRepayment}
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onModeOfRepaymentSelect("Deduction from salary")}
                            >
                              Deduction from salary
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onModeOfRepaymentSelect("One time payment")}
                            >
                              One time payment
                            </li>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* loan note */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="loanNote">Loan Note</label>
                        <textarea
                          type="text"
                          name="loanNote"
                          className="form-control"
                          id="loanNote"
                          rows="3"
                          value={formData.loanNote}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* attachment */}
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-11">
                            <p
                              className="text-secondary"
                              style={{ cursor: "pointer" }}
                              onClick={() => setFormData(prev => ({ ...prev, attachLoanFile: !prev.attachLoanFile }))}
                            >
                              Attachment (if any){" "}
                              <i
                                className={classNames("fa", {
                                  "fa-caret-down": !formData.attachLoanFile,
                                  "fa-caret-up": formData.attachLoanFile,
                                })}
                              ></i>
                            </p>
                            {formData.attachLoanFile ? (
                              <div className="input-group mb-3">
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile01"
                                    ref={fileInput}
                                    onChange={onFileChange}
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="inputGroupFile01"
                                  >
                                    {formData.attachmentName || "Choose file"}
                                  </label>
                                </div>
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={clearFile}
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>

              {/* bonus col */}
              <div className="col ml-5">
                <form
                  className="addEmpForm"
                  onSubmit={onBonusSubmit}
                >
                  <h2>Request for Bonus</h2>
                  <hr />

                  <div className="row">
                    {/* reason dropdown */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="bonusReason">Bonus Reason</label>
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {formData.bonusReason}
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onBonusReasonSelect("Employee Referral Program")}
                            >
                              Employee Referral Program
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onBonusReasonSelect("Performance Bonus")}
                            >
                              Performance Bonus
                            </li>
                            <li
                              style={{ cursor: "pointer" }}
                              className="dropdown-item btn-primary"
                              onClick={() => onBonusReasonSelect("Other")}
                            >
                              Other
                            </li>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* other reason */}
                    {formData.bonusReason === "Other" ? (
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="otherBonusReason">Other Reason</label>
                          <input
                            type="text"
                            name="otherBonusReason"
                            className="form-control"
                            id="otherBonusReason"
                            value={formData.otherBonusReason}
                            onChange={onChange}
                            required
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="row">
                    {/* bonus note */}
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="bonusNote">Bonus Note</label>
                        <textarea
                          type="text"
                          name="bonusNote"
                          className="form-control"
                          id="bonusNote"
                          rows="3"
                          value={formData.bonusNote}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* attachment */}
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-11">
                            <p
                              className="text-secondary"
                              style={{ cursor: "pointer" }}
                              onClick={() => setFormData(prev => ({ ...prev, attachBonusFile: !prev.attachBonusFile }))}
                            >
                              Attachment (if any){" "}
                              <i
                                className={classNames("fa", {
                                  "fa-caret-down": !formData.attachBonusFile,
                                  "fa-caret-up": formData.attachBonusFile,
                                })}
                              ></i>
                            </p>
                            {formData.attachBonusFile ? (
                              <div className="input-group mb-3">
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="inputGroupFile01"
                                    ref={fileInput}
                                    onChange={onFileChange}
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="inputGroupFile01"
                                  >
                                    {formData.attachmentName || "Choose file"}
                                  </label>
                                </div>
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={clearFile}
                                  >
                                    Clear
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default OtherRequests;
