import { createApi, fetchBaseQuery, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { authSlice } from '../slices/auth.slice';

// Define the User type for frontend use
export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  totalBonuses?: number;
  totalSpent?: number;
  isVerified?: boolean;
  profileImageUrl?: string;
};

// DTOs for API calls
export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'moderator';
};

export type UpdateUserDto = {
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'inactive' | 'banned' | 'pending';
  profileImageUrl?: string;
};

export type ChangeUserStatusDto = {
  status: 'active' | 'inactive' | 'banned' | 'pending';
};

export type ChangeUserRoleDto = {
  role: 'user' | 'admin' | 'moderator';
};

export type SendEmailDto = {
  subject: string;
  message: string;
};

export type BulkDeleteUsersDto = {
  userIds: string[];
};

export type BulkChangeStatusDto = {
  userIds: string[];
  status: 'active' | 'inactive' | 'banned' | 'pending';
};

const baseUrl = 'http://localhost:3003/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as any).auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
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
          url: 'auth/refresh',
          method: 'POST',
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

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // DEBUG endpoint
    debugUser: builder.query<any, void>({
      query: () => 'users/debug',
    }),
    
    // LIST all users
    getAllUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    
    // GET user by id
    getUserById: builder.query<User, string>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    // CREATE new user
    createUser: builder.mutation<User, CreateUserDto>({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    
    // UPDATE user
    updateUser: builder.mutation<User, { id: string; user: UpdateUserDto }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: user,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    // DELETE user
    deleteUser: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    // CHANGE user status
    changeUserStatus: builder.mutation<User, { id: string; status: ChangeUserStatusDto }>({
      query: ({ id, status }) => ({
        url: `users/${id}/status`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    // CHANGE user role
    changeUserRole: builder.mutation<User, { id: string; role: ChangeUserRoleDto }>({
      query: ({ id, role }) => ({
        url: `users/${id}/role`,
        method: 'PATCH',
        body: role,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    // SEND email to user
    sendEmailToUser: builder.mutation<{ sent: boolean }, { id: string; subject: string; message: string }>({
      query: ({ id, subject, message }) => ({
        url: `users/${id}/email`,
        method: 'POST',
        body: { subject, message },
      }),
    }),
    
    // BULK operations
    bulkDeleteUsers: builder.mutation<{ deleted: number }, string[]>({
      query: (userIds) => ({
        url: 'users/bulk-delete',
        method: 'POST',
        body: { userIds },
      }),
      invalidatesTags: ['User'],
    }),
    
    bulkChangeStatus: builder.mutation<{ updated: number }, { userIds: string[]; status: ChangeUserStatusDto }>({
      query: ({ userIds, status }) => ({
        url: 'users/bulk-status',
        method: 'POST',
        body: { userIds, status },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useDebugUserQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
  useChangeUserRoleMutation,
  useSendEmailToUserMutation,
  useBulkDeleteUsersMutation,
  useBulkChangeStatusMutation,
} = usersApi;
