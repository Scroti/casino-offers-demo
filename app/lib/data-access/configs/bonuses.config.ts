import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';

import type { Casino } from './casino.model';

// Define the Bonus type for frontend use
export type Bonus = {
  _id: string;
  casino?: string | Casino; // Reference to Casino (can be ObjectId or populated Casino object)
  title: string;
  description?: { title?: string; subtitle?: string; content?: string };
  price: string;
  rating?: number;
  type: string;
  casinoImage?: string;
  href?: string;
  createdAt?: string;
  updatedAt?: string;
  customSections?: Array<{ title: string; content: string; subtitle?: string; icon?: string }>;
  isExclusive?: boolean;
  casinoName?: string;
  casinoLogo?: string;
  safetyIndex?: number;
  countryFlag?: string;
  countryCode?: string;
  promoCode?: string;
  bonusInstructions?: string;
  reviewLink?: string;
  wageringRequirement?: { value?: string; subtitle?: string; content?: string };
  bonusValue?: { value?: string; subtitle?: string; content?: string };
  maxBet?: { value?: string; subtitle?: string; content?: string };
  expiration?: { value?: string; subtitle?: string; content?: string };
  claimSpeed?: { value?: string; subtitle?: string; content?: string };
  termsConditions?: { value?: string; subtitle?: string; content?: string };
  // Add future fields as needed
};

export const bonusesApi = createApi({
  reducerPath: 'bonusesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
    credentials: 'include', // Required for CORS with credentials
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
    // GET bonuses by casino ID
    getBonusesByCasino: builder.query<Bonus[], string>({
      query: (casinoId) => `bonuses/casino/${casinoId}`,
      providesTags: (result, error, casinoId) => [{ type: 'Bonus', id: `casino-${casinoId}` }],
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
  useGetBonusesByCasinoQuery,
  useGetBonusByIdQuery,
  useCreateBonusMutation,
  useUpdateBonusMutation,
  useDeleteBonusMutation,
} = bonusesApi;
