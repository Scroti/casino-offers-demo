import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3003/api/v1',
    prepareHeaders: (headers, { getState }) => {
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
