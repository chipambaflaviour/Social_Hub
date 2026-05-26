import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";
import Navbar from "./components/Navbar";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Network = lazy(() => import("./pages/Network"));
const Events = lazy(() => import("./pages/Events"));
const Admin = lazy(() => import("./pages/Admin"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));

const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return children;
};

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";
  const initializeData = useStore((state) => state.initializeData);
  const isInitialized = useStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized, initializeData]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
        <div className="w-12 h-12 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-background min-h-screen text-on-background font-body-md antialiased ${isAuthPage ? "" : "pt-16 pb-20 md:pb-0"}`}
    >
      {!isAuthPage && <Navbar />}
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
            <div className="w-12 h-12 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 font-label-md animate-pulse">
              Loading experience...
            </p>
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
