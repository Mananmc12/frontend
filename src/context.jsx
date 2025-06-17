import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

// Initial state
const initialState = {
  user: undefined,
  token: undefined,
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGGED_IN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };

    case "LOGGED_OUT":
      return {
        ...state,
        token: undefined,
        user: undefined,
      };

    case "APPROVED_REJECTED_LEAVE":
      return {
        ...state,
        user: {
          ...state.user,
          leaveRequests: state.user?.leaveRequests?.filter(
            (req) => req.reqId !== action.payload.reqId
          ),
        },
      };

    case "APPROVED_REJECTED_BONUS":
      return {
        ...state,
        user: {
          ...state.user,
          bonusRequests: state.user?.bonusRequests?.filter(
            (req) => req.reqId !== action.payload.reqId
          ),
        },
      };

    case "APPROVED_REJECTED_LOAN":
      return {
        ...state,
        user: {
          ...state.user,
          loanRequests: state.user?.loanRequests?.filter(
            (req) => req.reqId !== action.payload.reqId
          ),
        },
      };

    default:
      return state;
  }
};

// Create Context
export const Context = createContext();

// Context Provider Component
export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const checkLogin = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      try {
        // Check admin token
        const adminTokenRes = await axios.post("/api/admin/tokenIsValid", null, {
          headers: { "x-auth-token": token },
        });

        if (adminTokenRes.data) {
          const adminRes = await axios.get("/api/admin", {
            headers: { "x-auth-token": token },
          });

          dispatch({
            type: "LOGGED_IN",
            payload: {
              token,
              user: adminRes.data.user,
            },
          });
          return;
        }

        // Check user token
        const userTokenRes = await axios.post("/api/users/tokenIsValid", null, {
          headers: { "x-auth-token": token },
        });

        if (userTokenRes.data) {
          const userRes = await axios.get("/api/users", {
            headers: { "x-auth-token": token },
          });

          dispatch({
            type: "LOGGED_IN",
            payload: {
              token,
              user: userRes.data.user,
            },
          });
        }
      } catch (err) {
        console.error("Login check error:", err);
      }
    };

    checkLogin();
  }, []);

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
