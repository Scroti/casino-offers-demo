import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { authSlice } from './slices/auth.slice';
import type { AuthState } from './slices/auth.slice';
import { ENV } from '@/lib/constants/env';

type StoreWithAuth = { auth: AuthState };
type RefreshResponse = { accessToken: string; refreshToken: string };

const REFRESH_URL_FRAGMENT = '/refresh';

function prepareAuthHeaders(
  headers: Headers,
  { getState }: Pick<BaseQueryApi, 'getState'>
) {
  const token = (getState() as StoreWithAuth).auth.accessToken;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

export function createAuthBaseQuery(baseUrl: string) {
  return fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: prepareAuthHeaders,
  });
}

export function createBaseQueryWithReauth(
  baseQueryFn: ReturnType<typeof fetchBaseQuery>
) {
  return async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
  ) => {
    const url = typeof args === 'string' ? args : args.url;
    if (url?.endsWith(REFRESH_URL_FRAGMENT)) {
      return baseQueryFn(args, api, extraOptions);
    }

    let result = await baseQueryFn(args, api, extraOptions);

    if (result.error?.status !== 401) return result;

    const refreshToken = (api.getState() as StoreWithAuth).auth.refreshToken;
    if (!refreshToken) {
      api.dispatch(authSlice.actions.logout());
      return result;
    }

    const refreshBaseQuery = createAuthBaseQuery(`${ENV.API_URL}/auth`);
    const refreshResult = await refreshBaseQuery(
      { url: 'refresh', method: 'POST', body: { refreshToken } },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      api.dispatch(authSlice.actions.logout());
      return result;
    }

    const refreshData = refreshResult.data as RefreshResponse | undefined;
    if (!refreshData?.accessToken || !refreshData?.refreshToken) {
      api.dispatch(authSlice.actions.logout());
      return result;
    }

    api.dispatch(authSlice.actions.setCredentials(refreshData));
    return baseQueryFn(args, api, extraOptions);
  };
}
