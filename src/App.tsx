
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import MindMap from './components/Mindmap';
import { ReactFlowProvider } from '@xyflow/react';
import SideBar from './components/layout/Sidebar';
import RuleManagement from './components/rules';
import Login from './components/Auth/Login';

// Simulate authentication service
const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb: () => void) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: () => void) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100); // fake async
  }
};

// PrivateRoute component to protect routes
function PrivateRoute({ children }: { children: React.ReactNode }) {
  return fakeAuth.isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state on load
    setIsAuthenticated(fakeAuth.isAuthenticated);
  }, []);

  const handleLogin = () => {
    fakeAuth.authenticate(() => {
      setIsAuthenticated(true);
    });
  };

  // const handleLogout = () => {
  //   fakeAuth.signout(() => {
  //     setIsAuthenticated(false);
  //   });
  // };

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar only for authenticated users */}
        {isAuthenticated && <SideBar />}

        <div className="flex-1 ml-64 p-4 overflow-auto">
          <ReactFlowProvider>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/mindmap/:ruleId"
                element={
                  <PrivateRoute>
                    <MindMap />
                  </PrivateRoute>
                }
              />
              <Route
                path="/rules"
                element={
                  <PrivateRoute>
                    <RuleManagement />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to={isAuthenticated ? "/rules" : "/login"} />} />
            </Routes>
          </ReactFlowProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;


    