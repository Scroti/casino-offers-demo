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
import { ENV } from "@/lib/constants/env";

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  user: UserProfile | null;
  login: (accessToken: string, refreshToken: string) => void;
  logoutUser: () => void;
};

const COOKIE_OPTIONS = {
  sameSite: ENV.COOKIE_CONFIG.SAME_SITE,
  secure: ENV.COOKIE_CONFIG.SECURE,
  path: ENV.COOKIE_CONFIG.PATH,
} as const;

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedAccessToken = Cookies.get("accessToken");
    const savedRefreshToken = Cookies.get("refreshToken");

    if (savedAccessToken && savedRefreshToken) {
      dispatch(setCredentials({
        accessToken: savedAccessToken,
        refreshToken: savedRefreshToken,
      }));
    }
    setHydrated(true);
  }, [dispatch]);

  const { data: user, isSuccess } = useMeQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    Cookies.set("accessToken", accessToken, {
      expires: ENV.COOKIE_CONFIG.ACCESS_TOKEN_EXPIRES,
      ...COOKIE_OPTIONS,
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: ENV.COOKIE_CONFIG.REFRESH_TOKEN_EXPIRES,
      ...COOKIE_OPTIONS,
    });
  }, [accessToken, refreshToken]);

  const logoutUser = () => {
    dispatch(logout());
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
  };

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      hydrated,
      user: accessToken && isSuccess ? (user ?? null) : null,
      login: (newAccessToken: string, newRefreshToken: string) => {
        dispatch(setCredentials({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
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
