import { createApi } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';
import { createAuthBaseQuery, createBaseQueryWithReauth } from '../api-base';

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

const baseQueryWithReauth = createBaseQueryWithReauth(
  createAuthBaseQuery(ENV.API_URL)
);

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
