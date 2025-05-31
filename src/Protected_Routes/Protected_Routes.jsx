import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
function Protected_Routes({ children, msg, redirect }) {
  const [{ user }, dispatch] = useContext(DataContext);
  const naviage = useNavigate();
  useEffect(() => {
    if (!user) {
      naviage("/auth", { state: { msg, redirect } });
    }
    // return children;
  }, []);
  return <>{children}</>;
}

export default Protected_Routes;
