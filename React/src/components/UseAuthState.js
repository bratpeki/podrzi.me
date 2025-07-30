import { useEffect, createContext, useReducer } from "react";

const initialAuthStateContext = {
  initialized: false,
  loggedIn: false,
  accessToken: null,      // for normal users
  adminToken: null,       // for admins
  isAdmin: false,         // helper flag
};

const accessTokenKey = "accessToken";
const adminTokenKey = "adminToken";

function authStateReducer(state, action) {
  switch (action.type) {
    case "authCheck": {
      const accessToken = localStorage.getItem(accessTokenKey);
      const adminToken = localStorage.getItem(adminTokenKey);

      return {
        ...state,
        accessToken,
        adminToken,
        loggedIn: !!accessToken || !!adminToken,
        isAdmin: !!adminToken,
        initialized: true,
      };
    }

    case "login": {
      const { accessToken } = action.payload;
      localStorage.setItem(accessTokenKey, accessToken);
      return {
        ...state,
        accessToken,
        loggedIn: true,
        isAdmin: false,
      };
    }

    case "adminLogin": {
      const { adminToken } = action.payload;
      localStorage.setItem(adminTokenKey, adminToken);
      return {
        ...state,
        adminToken,
        loggedIn: true,
        isAdmin: true,
      };
    }

    case "logout": {
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(adminTokenKey);
      return {
        ...state,
        accessToken: null,
        adminToken: null,
        loggedIn: false,
        isAdmin: false,
      };
    }

    default:
      throw new Error("Unsupported authState action called");
  }
}


export function useAuth() {
  const [authState, authDispatch] = useReducer(
    authStateReducer,
    initialAuthStateContext
  );

  useEffect(() => {
    authDispatch({ type: "authCheck" });
  }, []);

  return { authState, authDispatch };
}

export const AuthStateContext = createContext(null);
