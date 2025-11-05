import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithReauth } from './auth.config';
import { ENV } from '@/lib/constants/env';
import type { Game } from '../models/game.model';

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

const baseQueryWithReauth = createBaseQueryWithReauth(baseQuery);

export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Game'],
  endpoints: (builder) => ({
    getAllGames: builder.query<Game[], void>({
      query: () => ({
        url: 'games',
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getActiveGames: builder.query<Game[], void>({
      query: () => ({
        url: 'games/active',
        method: 'GET',
      }),
      providesTags: ['Game'],
    }),
    getGameById: builder.query<Game, string>({
      query: (id) => ({
        url: `games/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Game', id }],
    }),
    getGameByGameId: builder.query<Game, string>({
      query: (gameId) => ({
        url: `games/gameId/${gameId}`,
        method: 'GET',
      }),
      providesTags: (result, error, gameId) => [{ type: 'Game', id: gameId }],
    }),
    createGame: builder.mutation<Game, Partial<Game>>({
      query: (data) => ({
        url: 'games',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Game'],
    }),
    updateGame: builder.mutation<Game, { id: string; data: Partial<Game> }>({
      query: ({ id, data }) => ({
        url: `games/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Game', id }],
    }),
    deleteGame: builder.mutation<void, string>({
      query: (id) => ({
        url: `games/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Game'],
    }),
    incrementGameViews: builder.mutation<Game, string>({
      query: (id) => ({
        url: `games/${id}/increment-views`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Game', id }],
    }),
    incrementGamePlays: builder.mutation<Game, string>({
      query: (id) => ({
        url: `games/${id}/increment-plays`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Game', id }],
    }),
    seedGames: builder.mutation<{ created: number; skipped: number }, Partial<Game>[]>({
      query: (games) => ({
        url: 'games/seed',
        method: 'POST',
        body: games,
      }),
      invalidatesTags: ['Game'],
    }),
  }),
});

export const {
  useGetAllGamesQuery,
  useGetActiveGamesQuery,
  useGetGameByIdQuery,
  useGetGameByGameIdQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useIncrementGameViewsMutation,
  useIncrementGamePlaysMutation,
  useSeedGamesMutation,
} = gamesApi;

