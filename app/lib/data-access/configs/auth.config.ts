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
  credentials: 'include', // Required for CORS with credentials
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

// Factory function to create baseQueryWithReauth for any baseQuery
export function createBaseQueryWithReauth(baseQueryFn: ReturnType<typeof fetchBaseQuery>) {
  return async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: {}
  ) => {
    // Prevent infinite refresh loops - don't retry refresh endpoint itself
    const url = typeof args === 'string' ? args : args.url;
    if (url === 'refresh' || url?.endsWith('/refresh') || url?.includes('/auth/refresh')) {
      return baseQueryFn(args, api, extraOptions);
    }

    let result = await baseQueryFn(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshToken = (api.getState() as any).auth.refreshToken;

    if (refreshToken) {
      try {
        // Use the auth baseQuery for refresh token
        const authBaseQuery = fetchBaseQuery({
          baseUrl: `${ENV.API_URL}/auth`,
          credentials: 'include',
          prepareHeaders(headers, { getState }) {
            const token = (getState() as any).auth.accessToken;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
          },
        });
        
        const refreshResult = await authBaseQuery(
          {
            url: "refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        // Check if refresh was successful
        if (refreshResult.error) {
          console.error('Refresh token failed:', refreshResult.error);
          api.dispatch(authSlice.actions.logout());
          return result;
        }

        const refreshData = refreshResult.data as RefreshResponse | undefined;

        if (refreshData && refreshData.accessToken && refreshData.refreshToken) {
          // save new tokens
          api.dispatch(
            authSlice.actions.setCredentials({
              accessToken: refreshData.accessToken,
              refreshToken: refreshData.refreshToken,
            })
          );

          // retry the original query with new access token
          result = await baseQueryFn(args, api, extraOptions);
        } else {
          console.error('Invalid refresh response:', refreshData);
          api.dispatch(authSlice.actions.logout());
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
        api.dispatch(authSlice.actions.logout());
      }
    } else {
      console.warn('No refresh token available');
      api.dispatch(authSlice.actions.logout());
    }
  }
  return result;
  };
}

// Use the factory function for auth API
const baseQueryWithReauth = createBaseQueryWithReauth(baseQuery);

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
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
      { message: string; requiresVerification: boolean },
      { name: string; email: string; password: string; country?: string; language?: string }
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
      providesTags: ['User'],
    }),
    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<
      { message: string; verified: boolean },
      { token?: string; code?: string }
    >({
      query: (data) => ({
        url: "verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendVerificationEmail: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "resend-verification",
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation<
      UserProfile,
      { name?: string; profileImageUrl?: string; gender?: 'male' | 'female' | 'prefer-not-to-say'; ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+' | 'prefer-not-to-say' }
    >({
      query: (data) => ({
        url: "profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useSignupMutation, 
  useLogoutMutation, 
  useMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useUpdateProfileMutation,
} = authApi;
