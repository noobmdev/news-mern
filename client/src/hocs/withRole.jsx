import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "context/GlobalContext";
import { useHistory } from "react-router-dom";

export default function withRole(WrappedComponent, rolesAccepted = []) {
  return () => {
    const { user } = useContext(GlobalContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (
        rolesAccepted.length &&
        !rolesAccepted.some((r) => user.role % r === 0)
      ) {
        history.push("/dashboard");
      } else {
        setLoading(false);
      }
    }, [history, user, rolesAccepted]);
    return !loading ? <WrappedComponent /> : null;
  };
}
