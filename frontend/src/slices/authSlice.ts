import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
interface User {
  user_id: string;
  role: "manager" | "member" // adjust based on your roles
  email?: string;
  name?: string;
}
interface AuthState {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authenticated: false,
  loading: true,
};


export const checkAuth = createAsyncThunk("auth/check", async () => {
  const res = await api.get("/auth/check");
  console.log("res",res);
  return res.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const res = await api.get("/auth/logout");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = action.payload.authenticated;
        state.user = action.payload.user || null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.authenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
  state.user = null;
  state.authenticated = false;
  state.loading = false;
});
  },
});

export default authSlice.reducer;
