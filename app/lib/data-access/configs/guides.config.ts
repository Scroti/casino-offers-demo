import { createApi } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';
import { createAuthBaseQuery, createBaseQueryWithReauth } from '../api-base';
import type { Guide } from '../models/guide.model';

export type { Guide };

const baseQueryWithReauth = createBaseQueryWithReauth(
  createAuthBaseQuery(ENV.API_URL)
);

export const guidesApi = createApi({
  reducerPath: 'guidesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Guide'],
  endpoints: (builder) => ({
    getAllGuides: builder.query<Guide[], { published?: boolean }>({
      query: ({ published }) => {
        const params = new URLSearchParams();
        if (published) params.append('published', 'true');
        return `guides?${params.toString()}`;
      },
      providesTags: ['Guide'],
    }),
    getGuideById: builder.query<Guide, string>({
      query: (id) => `guides/${id}`,
      providesTags: (result, error, id) => [{ type: 'Guide', id }],
    }),
    getGuideBySlug: builder.query<Guide, string>({
      query: (slug) => `guides/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Guide', id: slug }],
    }),
    getFeaturedGuides: builder.query<Guide[], void>({
      query: () => 'guides/featured',
      providesTags: ['Guide'],
    }),
    getGuidesByCategory: builder.query<Guide[], string>({
      query: (category) => `guides/category/${category}`,
      providesTags: ['Guide'],
    }),
    createGuide: builder.mutation<Guide, Partial<Guide>>({
      query: (guide) => ({
        url: 'guides',
        method: 'POST',
        body: guide,
      }),
      invalidatesTags: ['Guide'],
    }),
    updateGuide: builder.mutation<Guide, { id: string; guide: Partial<Guide> }>({
      query: ({ id, guide }) => ({
        url: `guides/${id}`,
        method: 'PATCH',
        body: guide,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Guide', id }],
    }),
    deleteGuide: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `guides/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Guide'],
    }),
    incrementViews: builder.mutation<void, string>({
      query: (id) => ({
        url: `guides/${id}/view`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAllGuidesQuery,
  useGetGuideByIdQuery,
  useGetGuideBySlugQuery,
  useGetFeaturedGuidesQuery,
  useGetGuidesByCategoryQuery,
  useCreateGuideMutation,
  useUpdateGuideMutation,
  useDeleteGuideMutation,
  useIncrementViewsMutation,
} = guidesApi;
