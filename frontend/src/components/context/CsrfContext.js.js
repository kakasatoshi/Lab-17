import { createContext, useContext } from "react";

const CsrfContext = createContext();

export const CsrfProvider = ({ csrfToken, children }) => {
  return (
    <CsrfContext.Provider value={csrfToken}>{children}</CsrfContext.Provider>
  );
};

export const useCsrf = () => useContext(CsrfContext);
