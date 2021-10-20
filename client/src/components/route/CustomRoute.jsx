import { GlobalContext } from "context/GlobalContext";
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { RouteTypes } from "routes";

export const CustomRoute = ({
  component: Component,
  type,
  location,
  ...rest
}) => {
  const { isAuthenticated } = useContext(GlobalContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        type === RouteTypes.ONLY_PRIVATE ? (
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/auth/login",
                state: { prePath: location.pathname },
              }}
            />
          )
        ) : type === RouteTypes.ONLY_PUBLIC ? (
          !isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
};
