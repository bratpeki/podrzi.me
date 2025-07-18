import { useEffect, createContext, useReducer } from "react";

const initialAuthStateContext = {
  initialized: false, // Postaje true kada se može raditi sa tokenom (kad je inicijalizovan)
  loggedIn: false, // Ako korisnik nije gost
  accessToken: null, // Šalje se sa svakim zahtjevom u fetch-u ("token": authState.accessToken)
};

const localStorageKey = "accessToken";

function authStateReducer(state, action) {
  if (!"type" in action)
    throw new Error("authState action must have a defined type");

  switch (action.type) {
    case "authCheck": {
      const localStorageAccessToken = localStorage.getItem(localStorageKey);

      if (!localStorageAccessToken)
        return {
          ...state,
          loggedIn: false,
          accessToken: null,
          initialized: true,
        };

      return {
        ...state,
        loggedIn: true,
        accessToken: localStorageAccessToken,
        initialized: true,
      };
    }
    case "login": {
      const { accessToken } = action.payload;
      localStorage.setItem(localStorageKey, accessToken);
      return { ...state, loggedIn: true, accessToken: accessToken };
    }
    case "logout": {
      localStorage.removeItem(localStorageKey);
      return { ...state, loggedIn: false, accessToken: null };
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
    authDispatch({
      type: "authCheck",
    });
  }, []);

  return { authState, authDispatch };
}

export const AuthStateContext = createContext(null);
