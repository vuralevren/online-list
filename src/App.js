import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import makeStore from "./redux/store";

import _ from "lodash";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as ProtectedRoute from "./components/core/protected-route";
import myRoutes from "./helpers/routes";
import ScrollToTop from "./components/scroll-top";
import JoinModal from "./components/modals/join-team-modal";
import useListenRealtime from "./helpers/useRealtime";

const store = makeStore();

export default function App() {
  useListenRealtime();

  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          {_.map(myRoutes, (route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.needAuth ? (
                  <ProtectedRoute.Private>
                    <route.component />
                  </ProtectedRoute.Private>
                ) : route.needAuth === null ? (
                  <route.component />
                ) : (
                  <ProtectedRoute.Public>
                    <route.component />
                  </ProtectedRoute.Public>
                )
              }
            />
          ))}
        </Routes>
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* <JoinModal /> */}
    </Provider>
  );
}
