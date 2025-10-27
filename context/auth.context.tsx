"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import type {
  RootState,
  AppDispatch,
} from "@/app/lib/data-access/store/store.config";
import {
  setCredentials,
  logout,
} from "@/app/lib/data-access/slices/auth.slice";
import { UserProfile } from "@/app/lib/data-access/models/user-profile.model";
import { useMeQuery } from "@/app/lib/data-access/configs/auth.config";

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  user: UserProfile | null;
  login: (accessToken: string, refreshToken: string) => void;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector(
    (state: RootState) => state.auth.refreshToken
  );
  const [hydrated, setHydrated] = useState(false);

  // Hydrate Redux state from cookies on mount
  useEffect(() => {
    const savedAccessToken = Cookies.get("accessToken");
    const savedRefreshToken = Cookies.get("refreshToken");

    if (savedAccessToken && savedRefreshToken) {
      dispatch(
        setCredentials({
          accessToken: savedAccessToken,
          refreshToken: savedRefreshToken,
        })
      );
    }
    setHydrated(true);
  }, [dispatch]);

  // Use RTK Query me endpoint to fetch user data
  const { data: user, isSuccess } = useMeQuery(undefined, {
    skip: !accessToken, // Skip if no token
  });

  // Save tokens to cookies when they change and are non-null
  useEffect(() => {
    if (accessToken && refreshToken) {

      // Set access token cookie (expires in 1 hour)
      Cookies.set("accessToken", accessToken, {
        expires: 1 / 24, // 1 hour
        sameSite: "strict",
        secure: false, // ✅ Set to false for localhost testing
        path: "/", // ✅ Make sure it's available across all paths
      });

      // Set refresh token cookie (expires in 7 days)
      Cookies.set("refreshToken", refreshToken, {
        expires: 7, // 7 days
        sameSite: "strict",
        secure: false, // ✅ Set to false for localhost testing
        path: "/", // ✅ Make sure it's available across all paths
      });

      // Verify cookies were set
     

      // Also keep in localStorage as backup
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [accessToken, refreshToken]);

  const logoutUser = () => {
    
    dispatch(logout());

    // Remove from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Remove from cookies with same options used to set them
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });


  };

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      hydrated,
      user: accessToken && isSuccess ? user ?? null : null,
      login: (newAccessToken: string, newRefreshToken: string) => {
        dispatch(
          setCredentials({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );
      },
      logoutUser,
    }),
    [accessToken, refreshToken, hydrated, user, isSuccess, dispatch]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
