import React from "react";
import { Provider } from "./context";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContactUs from "./components/layouts/ContactUs";
import PageNotFound from "./components/layouts/PageNotFound";
import About from "./components/layouts/About";

import "./App.css";
import Header from "./components/layouts/Header";
import AddEmployee from "./components/layouts/AddEmployee";
import Profile from "./components/layouts/Profile";
import EmpDashboard from "./components/layouts/EmpDashboard";
import Attendence from "./components/layouts/Employee/Attendence";
import ViewRequests from "./components/layouts/Admin/View Requests/ViewRequests";
import MyRequests from "./components/layouts/Employee/MyRequests";
import OtherRequests from "./components/layouts/Employee/OtherRequests";
import ViewEmployees from "./components/layouts/Admin/ViewEmployees";
import EditEmpProfile from "./components/layouts/Admin/EditEmpProfile";
import MySalDetails from "./components/layouts/Employee/MySalDetails";
import Payroll from "./components/layouts/Admin/Payroll";
import Statistics from "./components/layouts/Admin/Stats/Statistics";
import Options from "./components/layouts/Admin/Options";
import ViewSingleRequest from "./components/layouts/Employee/ViewSingleRequest";
import CompanyInfo from "./components/layouts/Employee/CompanyInfo";
import ActiveLoans from "./components/layouts/Admin/ActiveLoans";

const App = () => {
  return (
    <Provider>
      <Router>
        <Header branding="HRMS" />

        <Routes>
          {/* General */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/about" element={<About />} />

          {/* Employee */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/attendence" element={<Attendence />} />
          <Route path="/myRequests" element={<MyRequests />} />
          <Route path="/empDashboard" element={<EmpDashboard />} />
          <Route path="/otherRequest" element={<OtherRequests />} />
          <Route path="/mySalDetails" element={<MySalDetails />} />
          <Route path="/companyInfo" element={<CompanyInfo />} />
          <Route path="/viewSingleRequest/:title/:reqId" element={<ViewSingleRequest />} />

          {/* Admin */}
          <Route path="/" element={<Statistics />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/viewRequests" element={<ViewRequests />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/options" element={<Options />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/viewEmployees" element={<ViewEmployees />} />
          <Route path="/activeLoans" element={<ActiveLoans />} />
          <Route path="/editEmpProfile/:id" element={<EditEmpProfile />} />

          {/* Fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
