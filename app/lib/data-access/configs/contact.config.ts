import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';

export type ContactRequest = {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
};

export type ContactResponse = {
  message: string;
  id?: string;
};

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    contact: builder.mutation<ContactResponse, ContactRequest>({
      query: (data) => ({
        url: 'contact',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useContactMutation } = contactApi;

