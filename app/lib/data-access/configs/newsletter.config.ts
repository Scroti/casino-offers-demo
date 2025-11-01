import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
    credentials: 'include', // Required for CORS with credentials
    prepareHeaders: (headers, { getState }) => {
      // Set Accept header - tells server we expect JSON response
      headers.set('Accept', 'application/json');
      // Set Content-Type - RTK Query sets this automatically for JSON bodies, but being explicit
      headers.set('Content-Type', 'application/json');
      // Set Authorization if token exists
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Subscribers'],
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation<
      { subscribed: boolean; subscription: any }, 
      string
    >({
      query: (email) => ({
        url: 'newsletter/subscribe',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Subscribers'],
    }),
    unsubscribeFromNewsletter: builder.mutation<
      { unsubscribed: boolean; message: string; subscription: any }, 
      string
    >({
      query: (email) => ({
        url: 'newsletter/unsubscribe',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Subscribers'],
    }),
    checkIfNewsletterSubscriber: builder.mutation<
      { subscribed: boolean }, 
      string
    >({
      query: (email) => ({
        url: 'newsletter/check',
        method: 'POST',
        body: { email },
      }),
    }),
    getAllNewsletterSubscribers: builder.query<any[], void>({
      query: () => 'admin/newsletter/all',
      providesTags: ['Subscribers'],
    }),
  }),
});

export const {
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation,
  useCheckIfNewsletterSubscriberMutation,
  useGetAllNewsletterSubscribersQuery,
} = newsletterApi;
