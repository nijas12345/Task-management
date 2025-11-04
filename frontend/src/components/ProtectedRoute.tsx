import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { user, authenticated, loading } = useSelector(
    (s: RootState) => s.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && authenticated) {
      if (user?.role === "manager") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else if (!loading && !authenticated) {
      navigate("/login");
    }
  }, [loading, authenticated, user, navigate]);

  if (loading) return <div>Loading...</div>;
  return authenticated ? children : null;
};

export default ProtectedRoute;
