import axios from "axios";
import React, { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import EmpSidePanel from "./EmpSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import classNames from "classnames";
import { Spring } from "@react-spring/web";
import { Context } from "../../../context";

const Attendence = () => {
  const [subject, setSubject] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachFile, setAttachFile] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [file, setFile] = useState("");
  const { user } = useContext(Context);
  const navigate = useNavigate();
  let fileInput = React.createRef();

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject") setSubject(value);
    else if (name === "fromDate") setFromDate(value);
    else if (name === "toDate") setToDate(value);
    else if (name === "reason") setReason(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let uploadedAttachmentName = attachmentName;
    // upload file if selected
    if (file) {
      const data = new FormData();
      data.append("file", file);
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
        uploadedAttachmentName = fileUploadRes.data.filename;
        setAttachmentName(fileUploadRes.data.filename);
      } catch (err) {
        console.log(err);
      }
    }
    const request = {
      title: "leave request",
      reqId: uuidv4(),
      empId: user._id,
      empName: user.name,
      gender: user.gender,
      empRole: user.role,
      empTeam: user.team,
      subject,
      empEmail: user.email,
      date: new Date(),
      fromDate,
      toDate,
      reason,
      attachmentName: uploadedAttachmentName,
      approved: false,
      ticketClosed: false,
    };
    // push to admin notification
    await axios.put("/api/users/applyLeave", { request });
    toast.notify("Successfully submitted loan request", {
      position: "top-right",
    });
    navigate("/myRequests");
  };

  const onFileChange = (e) => {
    try {
      setFile(e.target.files[0]);
      setAttachmentName(e.target.files[0].name);
    } catch (e) {
      console.log(e);
    }
  };

  const clearFile = (e) => {
    e.preventDefault();
    if (fileInput.current) fileInput.current.value = "";
    setFile("");
    setAttachmentName("");
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
      from={{ transform: "translate3d(1000px,0,0) " }}
      to={{ transform: "translate3d(0px,0,0) " }}
      config={{ friction: 20 }}
    >
      {(props) => (
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <EmpSidePanel />
          </div>
          {/* right part */}
          <div
            className="col rightPart container"
            style={{
              display: "flex ",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div style={props}>
              <form
                style={{ minWidth: "900px" }}
                className="addEmpForm"
                onSubmit={onSubmit}
              >
                <h2>Apply for Leave</h2>
                <hr />
                <div className="row">
                  <div className="col">
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="subject">Subject</label>
                          <input
                            required
                            type="text"
                            name="subject"
                            className="form-control"
                            id="subject"
                            value={subject}
                            onChange={onChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="fromDate">From</label>
                          <input
                            required
                            type="date"
                            name="fromDate"
                            className="form-control"
                            id="fromDate"
                            value={fromDate}
                            onChange={onChange}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="toDate">To</label>
                          <input
                            required
                            type="date"
                            name="toDate"
                            className="form-control"
                            id="toDate"
                            value={toDate}
                            onChange={onChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 2nd col */}
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="reason">Reason</label>
                      <textarea
                        required
                        type="text"
                        name="reason"
                        className="form-control"
                        id="reason"
                        rows="5"
                        value={reason}
                        onChange={onChange}
                      />
                    </div>
                    {/* attachment */}
                    <div className="form-group">
                      <div className="row">
                        <div className="col-11">
                          <p
                            className="text-secondary"
                            style={{ cursor: "pointer" }}
                            onClick={() => setAttachFile((prev) => !prev)}
                          >
                            Attachment (if any){" "}
                            <i
                              className={classNames("fa", {
                                "fa-caret-down": !attachFile,
                                "fa-caret-up": attachFile,
                              })}
                            ></i>
                          </p>
                          {attachFile ? (
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
                                  {attachmentName || "Choose file"}
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
                <div className="row mt-4">
                  <div className="col text-center">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default Attendence;
