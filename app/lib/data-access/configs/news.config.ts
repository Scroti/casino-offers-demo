import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';

export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  image?: string;
  author?: string;
  source?: string;
}

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
    credentials: 'include',
  }),
  tagTypes: ['News'],
  endpoints: (builder) => ({
    getNews: builder.query<NewsArticle[], { limit?: number; category?: string; country?: string }>({
      query: ({ limit, category, country }) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (category) params.append('category', category);
        if (country) params.append('country', country);
        return `news?${params.toString()}`;
      },
      providesTags: ['News'],
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;

