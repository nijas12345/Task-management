import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../slices/authSlice";
import type { RootState, AppDispatch } from "../store";

const PublicRoute = ({ children }: { children: React.JSX.Element }) => {
  const { authenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
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
    }
  }, [loading, authenticated, user, navigate]);

  if (loading) return <div>Loading...</div>;

  return !authenticated ? children : null;
};

export default PublicRoute;
