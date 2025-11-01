import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { authSlice } from "../slices/auth.slice";
import { UserProfile } from "../models/user-profile.model";
import { ENV } from "@/lib/constants/env";

const baseUrl = `${ENV.API_URL}/auth`;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as any).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshToken = (api.getState() as any).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      const refreshData = refreshResult.data as RefreshResponse | undefined;

      if (refreshData) {
        // save new tokens
        api.dispatch(
          authSlice.actions.setCredentials({
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken,
          })
        );

        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(authSlice.actions.logout());
      }
    } else {
      api.dispatch(authSlice.actions.logout());
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; refreshToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation<
      { accessToken: string; refreshToken: string },
      { name: string; email: string; password: string }
    >({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    me: builder.query<UserProfile, void>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useMeQuery } =
  authApi;
