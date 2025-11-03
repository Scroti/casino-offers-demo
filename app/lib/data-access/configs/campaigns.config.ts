import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '@/lib/constants/env';

export type Campaign = {
  _id: string;
  token: string;
  name: string;
  description?: string;
  isActive: boolean;
  expiresAt?: string;
  startsAt?: string;
  clickCount: number;
  bonusAccessCount: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCampaignDto = {
  token: string;
  name: string;
  description?: string;
  isActive?: boolean;
  expiresAt?: string;
  startsAt?: string;
  createdBy?: string;
};

export type UpdateCampaignDto = {
  name?: string;
  description?: string;
  isActive?: boolean;
  expiresAt?: string;
  startsAt?: string;
};

export type ValidateCampaignResponse = {
  valid: boolean;
  campaign?: Campaign;
  message?: string;
};

export const campaignsApi = createApi({
  reducerPath: 'campaignsApi',
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
  tagTypes: ['Campaign'],
  endpoints: (builder) => ({
    // LIST all campaigns (admin only)
    getAllCampaigns: builder.query<Campaign[], void>({
      query: () => 'campaigns',
      providesTags: ['Campaign'],
    }),
    // GET campaign by id (admin only)
    getCampaignById: builder.query<Campaign, string>({
      query: (id) => `campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    // VALIDATE campaign token (public)
    validateCampaignToken: builder.query<ValidateCampaignResponse, string>({
      query: (token) => `campaigns/validate?token=${token}`,
    }),
    // CREATE campaign (admin only)
    createCampaign: builder.mutation<Campaign, CreateCampaignDto>({
      query: (campaign) => ({
        url: 'campaigns',
        method: 'POST',
        body: campaign,
      }),
      invalidatesTags: ['Campaign'],
    }),
    // UPDATE campaign (admin only)
    updateCampaign: builder.mutation<Campaign, { id: string; campaign: UpdateCampaignDto }>({
      query: ({ id, campaign }) => ({
        url: `campaigns/${id}`,
        method: 'PATCH',
        body: campaign,
      }),
      invalidatesTags: ['Campaign'],
    }),
    // DELETE campaign (admin only)
    deleteCampaign: builder.mutation<{ deleted: boolean }, string>({
      query: (id) => ({
        url: `campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Campaign'],
    }),
  }),
});

export const {
  useGetAllCampaignsQuery,
  useGetCampaignByIdQuery,
  useValidateCampaignTokenQuery,
  useLazyValidateCampaignTokenQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignsApi;

