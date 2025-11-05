import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Casino } from '../models/casino.model';
import { ENV } from '@/lib/constants/env';

export const casinosApi = createApi({
  reducerPath: 'casinosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
    credentials: 'include', // Required for CORS with credentials
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Casino'],
  endpoints: (builder) => ({
    // LIST all casinos
    getAllCasinos: builder.query<Casino[], void>({
      query: () => 'casinos',
      providesTags: ['Casino'],
    }),
    // GET details by id
    getCasinoById: builder.query<Casino, string>({
      query: (id) => `casinos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Casino', id }],
    }),
    // CREATE
    createCasino: builder.mutation<Casino, Partial<Casino>>({
      query: (casino) => ({
        url: 'casinos',
        method: 'POST',
        body: casino,
      }),
      invalidatesTags: ['Casino'],
    }),
    // UPDATE
    updateCasino: builder.mutation<Casino, { id: string; casino: Partial<Casino> }>({
      query: ({ id, casino }) => ({
        url: `casinos/${id}`,
        method: 'PATCH',
        body: casino,
      }),
      invalidatesTags: ['Casino'],
    }),
    // DELETE
    deleteCasino: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `casinos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Casino'],
    }),
  }),
});

export const {
  useGetAllCasinosQuery,
  useGetCasinoByIdQuery,
  useCreateCasinoMutation,
  useUpdateCasinoMutation,
  useDeleteCasinoMutation,
} = casinosApi;

