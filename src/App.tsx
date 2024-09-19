import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import MindMap from "./components/Mindmap";
import { ReactFlowProvider } from "@xyflow/react";
import SideBar from "./components/layout/Sidebar";
import RuleManagement from "./components/rules";
import Login from "./components/Auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthProvider";
import PrivateRoute from "./routes/PrivateRoute";
import ConfigurationManagement from "./components/configs/inex";

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router> {/* Router should be here */}
      <div className="flex h-screen">
        <ToastContainer />

        {isAuthenticated && <SideBar />}

        <div className={`flex-1 ${isAuthenticated ? "md:ml-64" : "w-full"} p-4 overflow-auto`}>
          <ReactFlowProvider>
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/pathways" /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/pathways" /> : <Login />}
              />
              <Route
                path="/mindmap/:ruleId"
                element={
                  <PrivateRoute>
                    <MindMap />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pathways"
                element={
                  <PrivateRoute>
                    <RuleManagement />
                  </PrivateRoute>
                }
              />
              <Route path="/criteria" element={<ConfigurationManagement />} />
            </Routes>
          </ReactFlowProvider>
        </div>
      </div>
    </Router>
  );
};

export default App;
