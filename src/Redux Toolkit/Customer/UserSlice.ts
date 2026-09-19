// src/slices/userSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../../Config/Api";
import type { User, UserState } from "../../types/userTypes";
import type { RootState } from "../Store";

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  profileUpdated: false,
};

// Define the base URL for the API
const API_URL = "/api/users";

export const fetchUserProfile = createAsyncThunk<
  User,
  { jwt: string; navigate: any }
>(
  "user/fetchUserProfile",
  async (
    { jwt, navigate }: { jwt: string; navigate: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log(" user profile ", response.data);
      if (response.data.role === "ROLE_ADMIN") {
        navigate("/admin");
      }
      return response.data;
    } catch (error: any) {
      console.log("error ", error.response);
      return rejectWithValue("Failed to fetch user profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  User,
  { jwt: string; user: Partial<User> }
>(
  "user/updateUserProfile",
  async ({ jwt, user }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_URL}/profile`, user, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("updated user profile ", response.data);
      return response.data;
    } catch (error: any) {
      console.log("update error ", error.response);
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.profileUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.profileUpdated = false;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.loading = false;
          state.profileUpdated = true;
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profileUpdated = false;
      });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
