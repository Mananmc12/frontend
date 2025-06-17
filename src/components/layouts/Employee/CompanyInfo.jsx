import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";
import Faq from "./Faq";
import HolidayList from "./HolidayList";
import CompanyPolicy from "./CompanyPolicy";
import { Spring } from "@react-spring/web";

const CompanyInfo = () => {
  const [selectedTab, setSelectedTab] = useState("Company Policy");
  const { user } = useContext(Context);
  const navigate = useNavigate();

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
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <EmpSidePanel />
          </div>

          {/* right part */}
          <div className="col rightPart container" style={props}>
            <div className="row">
              {/* tab selection */}
              <div className="col">
                <div className="text-right my-4">
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className={`btn btn-primary${selectedTab === "Company Policy" ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="options"
                        id="option1"
                        checked={selectedTab === "Company Policy"}
                        onChange={() => setSelectedTab("Company Policy")}
                      />
                      Company Policy
                    </label>
                    <label className={`btn btn-primary${selectedTab === "Holiday List" ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="options"
                        id="option2"
                        checked={selectedTab === "Holiday List"}
                        onChange={() => setSelectedTab("Holiday List")}
                      />
                      Holiday List
                    </label>
                    <label className={`btn btn-primary${selectedTab === "FAQ" ? " active" : ""}`}>
                      <input
                        type="radio"
                        name="options"
                        id="option3"
                        checked={selectedTab === "FAQ"}
                        onChange={() => setSelectedTab("FAQ")}
                      />
                      FAQ
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* main content */}
            <div className="row">
              <div className="col">
                {selectedTab === "Company Policy" ? (
                  <CompanyPolicy />
                ) : selectedTab === "FAQ" ? (
                  <Faq />
                ) : (
                  <HolidayList />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default CompanyInfo;
