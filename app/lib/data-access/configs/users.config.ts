import { createApi } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';
import { createAuthBaseQuery, createBaseQueryWithReauth } from '../api-base';

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
  gender?: 'male' | 'female' | 'prefer-not-to-say';
  ageRange?: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+' | 'prefer-not-to-say';
  country?: string;
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
  role: 'user' | 'admin';
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

const baseQueryWithReauth = createBaseQueryWithReauth(
  createAuthBaseQuery(ENV.API_URL)
);

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
      invalidatesTags: ['User'],
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
