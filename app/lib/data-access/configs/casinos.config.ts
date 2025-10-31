import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Casino } from '../models/casino.model';
import { mockCasinos } from './casinos.mock';

// Helper to determine if we should use mock data
const shouldUseMock = () => {
  // Use mock if API URL is not set or if we're in development without backend
  return !process.env.NEXT_PUBLIC_API_URL || 
         process.env.NEXT_PUBLIC_USE_MOCK_CASINOS === 'true';
};

export const casinosApi = createApi({
  reducerPath: 'casinosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1',
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
      queryFn: async () => {
        // Use mock data if configured or if API is unavailable
        if (shouldUseMock()) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          return { data: mockCasinos };
        }
        
        // Try to fetch from API
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1'}/casinos`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }
          
          const data = await response.json();
          return { data };
        } catch (error) {
          // Fallback to mock data on error
          console.warn('Failed to fetch casinos from API, using mock data:', error);
          await new Promise(resolve => setTimeout(resolve, 300));
          return { data: mockCasinos };
        }
      },
      providesTags: ['Casino'],
    }),
    // GET details by id
    getCasinoById: builder.query<Casino, string>({
      queryFn: async (id) => {
        // Use mock data if configured
        if (shouldUseMock()) {
          await new Promise(resolve => setTimeout(resolve, 300));
          const casino = mockCasinos.find(c => c._id === id);
          if (!casino) {
            return { error: { status: 404, data: 'Casino not found' } };
          }
          return { data: casino };
        }
        
        // Try to fetch from API
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1'}/casinos/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }
          
          const data = await response.json();
          return { data };
        } catch (error) {
          // Fallback to mock data on error
          console.warn('Failed to fetch casino from API, using mock data:', error);
          await new Promise(resolve => setTimeout(resolve, 300));
          const casino = mockCasinos.find(c => c._id === id);
          if (!casino) {
            return { error: { status: 404, data: 'Casino not found' } };
          }
          return { data: casino };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Casino', id }],
    }),
  }),
});

export const { useGetAllCasinosQuery, useGetCasinoByIdQuery } = casinosApi;

