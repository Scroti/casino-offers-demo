import { createApi, fetchBaseQuery, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';
import { authSlice } from '../slices/auth.slice';

export type Contact = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  isRead?: boolean;
  isResolved?: boolean;
  response?: string;
  respondedAt?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
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
  // Prevent infinite refresh loops - don't retry refresh endpoint itself
  const url = typeof args === 'string' ? args : args.url;
  if (url === 'refresh' || url?.endsWith('/refresh')) {
    return baseQuery(args, api, extraOptions);
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshToken = (api.getState() as any).auth.refreshToken;

    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: 'auth/refresh',
            method: 'POST',
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
          result = await baseQuery(args, api, extraOptions);
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

export const contactManagementApi = createApi({
  reducerPath: 'contactManagementApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    getAllContacts: builder.query<Contact[], void>({
      query: () => 'contact',
      providesTags: ['Contact'],
    }),
    getContactById: builder.query<Contact, string>({
      query: (id) => `contact/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contact', id }],
    }),
    markAsRead: builder.mutation<Contact, string>({
      query: (id) => ({
        url: `contact/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Contact'],
    }),
    markAsResolved: builder.mutation<Contact, { id: string; response?: string }>({
      query: ({ id, response }) => ({
        url: `contact/${id}/resolve`,
        method: 'PATCH',
        body: { response },
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useMarkAsReadMutation,
  useMarkAsResolvedMutation,
} = contactManagementApi;

