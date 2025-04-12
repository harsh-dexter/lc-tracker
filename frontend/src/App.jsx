import React, { useState, useEffect, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is missing in .env");
       return;
     }
 
     console.log('Checking auth status with backend:', backendUrl); // Log: Indicate check start
 
     fetch(`${backendUrl}/auth/status`, { credentials: "include" })
       .then((res) => {
          console.log('Auth status response status:', res.status); // Log: Response status code
          // Clone response to log body without consuming it for the next .then()
          const clonedRes = res.clone();
          clonedRes.json().then(data => console.log('Auth status response data:', data)).catch(e => console.error('Error parsing auth status JSON:', e)); // Log: Response body
          if (!res.ok) {
             console.error('Auth status request failed with status:', res.status);
          }
          return res.json();
       })
       .then((data) => {
         // console.log('Auth status data received:', data); // Already logged above
         if (data.isAuthenticated) {
           console.log('User is authenticated, setting user state:', data.user); // Log: Success case
          setUser(data.user);
         } else {
           console.log('User is not authenticated according to response.'); // Log: Failure case
         }
         setLoading(false);
       })
       .catch((error) => {
         console.error("Error checking auth status:", error.message, error); // Log: Fetch error details
        setLoading(false);
      });
  }, []);

  if (loading) {
    // Skeleton matching LoginPage structure
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center space-y-4">
            {/* Skeleton for Title */}
            <Skeleton height={36} width={250} className="mx-auto" />
            {/* Skeleton for Subtitle */}
            <Skeleton height={20} width={300} className="mx-auto" />
          </div>
          <div className="mt-8">
            {/* Skeleton for Button */}
            <Skeleton height={40} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
