import { createApi, fetchBaseQuery, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';
import { authSlice } from '../slices/auth.slice';

export interface Guide {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  categories?: string[];
  featuredImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  author?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedGuides?: string[];
  createdAt?: string;
  updatedAt?: string;
}

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
  const url = typeof args === 'string' ? args : args.url;
  if (url === 'refresh' || url?.endsWith('/refresh')) {
    return baseQuery(args, api, extraOptions);
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
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

        if (refreshResult.error) {
          console.error('Refresh token failed:', refreshResult.error);
          api.dispatch(authSlice.actions.logout());
          return result;
        }

        const refreshData = refreshResult.data as RefreshResponse | undefined;

        if (refreshData && refreshData.accessToken && refreshData.refreshToken) {
          api.dispatch(
            authSlice.actions.setCredentials({
              accessToken: refreshData.accessToken,
              refreshToken: refreshData.refreshToken,
            })
          );

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

