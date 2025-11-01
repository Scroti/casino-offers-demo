import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Casino } from '../models/casino.model';
import { mockCasinos } from './casinos.mock';
import { ENV } from '@/lib/constants/env';

// Helper to determine if we should use mock data
const shouldUseMock = () => {
  return ENV.USE_MOCK_CASINOS;
};

export const casinosApi = createApi({
  reducerPath: 'casinosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_URL,
    credentials: 'include', // Required for CORS with credentials
    prepareHeaders: (headers, { getState }) => {
      // Set Accept header - tells server we expect JSON response
      headers.set('Accept', 'application/json');
      // Set Content-Type - RTK Query sets this automatically for JSON bodies, but being explicit
      headers.set('Content-Type', 'application/json');
      // Set Authorization if token exists
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
            `${ENV.API_URL}/casinos`,
            {
              method: 'GET',
              credentials: 'include', // Required for CORS with credentials
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
            `${ENV.API_URL}/casinos/${id}`,
            {
              method: 'GET',
              credentials: 'include', // Required for CORS with credentials
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

