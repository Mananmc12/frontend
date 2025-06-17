import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context";
import EmpSidePanel from "./Employee/EmpSidePanel";
import maleProfilePic from "../../assets/view-emp/maleUserPic.png";
import femaleProfilePic from "../../assets/view-emp/femaleUserPic.png";
import "../../assets/empDashboard.css";
import NewsCard from "./Employee/NewsCard";
import { Spring } from "@react-spring/web";

const EmpDashboard = () => {
  const [firstCol, setFirstCol] = useState([]);
  const [secondCol, setSecondCol] = useState([]);
  const [ThirdCol, setThirdCol] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const news = await axios.get("/api/users/getNews");
      let first = [];
      let second = [];
      let third = [];
      for (let i = 0; i < 2; i++) first.push(news.data.articles[i]);
      for (let i = 2; i < 4; i++) second.push(news.data.articles[i]);
      for (let i = 4; i < 6; i++) third.push(news.data.articles[i]);
      setFirstCol(first);
      setSecondCol(second);
      setThirdCol(third);
    };
    fetchNews();
  }, []);

  const onGreet = () => {
    let date = new Date();
    let hours = date.getHours();
    if (hours < 12) return "Good Morning!";
    else if (hours >= 12 && hours <= 17) return "Good Afternoon!";
    else return "Good Evening!";
  };

  const onGetDate = () => {
    const d = new Date();
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    return `${da} ${mo} ${ye}`;
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
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ duration: 300 }}>
      {(props) => (
        <div className="row m-0">
          {/* left part */}
          <div className="col-2 p-0 leftPart">
            <EmpSidePanel />
          </div>
          {/* right part */}
          <div className="col rightPart" style={props}>
            <h1 className="display-4 mt-5 ml-5">Dashboard</h1>
            {/* profile part */}
            <div className="row">
              <div className="col">
                <div className="myProfileContainer">
                  <div className="row">
                    <div className="col">
                      {user && user.gender ? (
                        <img
                          className=""
                          src={user.gender === "Male" ? maleProfilePic : femaleProfilePic}
                          alt=""
                          width="300px"
                        />
                      ) : null}
                    </div>
                    <div className="col text-right">
                      <h1 className="display-4">
                        Hi <br /> {user && user.name}, <br /> {onGreet()}
                      </h1>
                      <p className="mt-4 " style={{ fontSize: "34px" }}>
                        <i className="fas fa-calendar-alt"></i> {onGetDate()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            {/* news part */}
            <div className="row">
              <div className="col">
                <div className="myNewsContainer">
                  <h1 className="display-4">NEWS</h1>
                  {firstCol.length ? (
                    <div className="row">
                      <div className="col m-0 p-0">
                        <div className="container">
                          <div className="row" style={{ display: "flex" }}>
                            {firstCol.map((news, index) => (
                              <NewsCard key={index} data={news} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col m-0 p-0">
                        <div className="container">
                          <div className="row" style={{ display: "flex" }}>
                            {secondCol.map((news, index) => (
                              <NewsCard key={index} data={news} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col m-0 p-0">
                        <div className="container">
                          <div className="row" style={{ display: "flex" }}>
                            {ThirdCol.map((news, index) => (
                              <NewsCard key={index} data={news} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <strong>Fetching new for you...</strong>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default EmpDashboard;
