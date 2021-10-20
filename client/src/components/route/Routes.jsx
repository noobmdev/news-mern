import { Layout } from "components/UI/Layout";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { routes, RouteTypes } from "routes";
import { CustomRoute } from "./CustomRoute";

export const Routes = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          {routes.map(({ path, component, exact, type }, idx) =>
            typeof type !== "undefined" && type !== RouteTypes.ALL ? (
              <CustomRoute
                key={idx}
                path={path}
                component={component}
                type={type}
                exact={exact}
              />
            ) : (
              <Route
                key={idx}
                path={path}
                component={component}
                exact={exact}
              />
            )
          )}
        </Switch>
      </Layout>
    </Router>
  );
};
