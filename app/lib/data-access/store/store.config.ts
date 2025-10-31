  import { configureStore } from "@reduxjs/toolkit";
  import { newsletterApi } from "../configs/newsletter.config";
  import { authApi } from "../configs/auth.config";
  import authReducer from "../slices/auth.slice";
import { bonusesApi } from "../configs/bonuses.config";
import { casinosApi } from "../configs/casinos.config";
import { usersApi } from "../configs/users.config";
  export const store = configureStore({
    reducer: {
      auth: authReducer,
      [newsletterApi.reducerPath]: newsletterApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [bonusesApi.reducerPath]:bonusesApi.reducer,
      [casinosApi.reducerPath]:casinosApi.reducer,
      [usersApi.reducerPath]:usersApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(newsletterApi.middleware, authApi.middleware,bonusesApi.middleware,casinosApi.middleware,usersApi.middleware),
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
