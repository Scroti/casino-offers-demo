import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the Bonus type for frontend use
export type Bonus = {
  _id: string;
  title: string;
  description: string;
  price: string;
  rating?: number;
  type: string;
  image: string;
  href?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add future fields as needed
};

export const bonusesApi = createApi({
  reducerPath: 'bonusesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Bonus'],
  endpoints: (builder) => ({
    // LIST all bonuses
    getAllBonuses: builder.query<Bonus[], void>({
      query: () => 'bonuses',
      providesTags: ['Bonus'],
    }),
    // GET details by id
    getBonusById: builder.query<Bonus, string>({
      query: (id) => `bonuses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bonus', id }],
    }),
    // CREATE
    createBonus: builder.mutation<Bonus, Partial<Bonus>>({
      query: (bonus) => ({
        url: 'bonuses',
        method: 'POST',
        body: bonus,
      }),
      invalidatesTags: ['Bonus'],
    }),
    // UPDATE
    updateBonus: builder.mutation<Bonus, { id: string; bonus: Partial<Bonus> }>({
      query: ({ id, bonus }) => ({
        url: `bonuses/${id}`,
        method: 'PATCH',
        body: bonus,
      }),
      invalidatesTags: ['Bonus'],
    }),
    // DELETE
    deleteBonus: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `bonuses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bonus'],
    }),
  }),
});

export const {
  useGetAllBonusesQuery,
  useGetBonusByIdQuery,
  useCreateBonusMutation,
  useUpdateBonusMutation,
  useDeleteBonusMutation,
} = bonusesApi;
