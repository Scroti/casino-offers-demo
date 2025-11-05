  import { configureStore } from "@reduxjs/toolkit";
  import { newsletterApi } from "../configs/newsletter.config";
  import { authApi } from "../configs/auth.config";
  import authReducer from "../slices/auth.slice";
import { bonusesApi } from "../configs/bonuses.config";
import { casinosApi } from "../configs/casinos.config";
import { usersApi } from "../configs/users.config";
import { campaignsApi } from "../configs/campaigns.config";
import { contactApi } from "../configs/contact.config";
import { contactManagementApi } from "../configs/contact-management.config";
import { newsApi } from "../configs/news.config";
import { guidesApi } from "../configs/guides.config";
import { gamesApi } from "../configs/games.config";
  export const store = configureStore({
    reducer: {
      auth: authReducer,
      [newsletterApi.reducerPath]: newsletterApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [bonusesApi.reducerPath]:bonusesApi.reducer,
      [casinosApi.reducerPath]:casinosApi.reducer,
      [usersApi.reducerPath]:usersApi.reducer,
      [campaignsApi.reducerPath]:campaignsApi.reducer,
      [contactApi.reducerPath]: contactApi.reducer,
      [contactManagementApi.reducerPath]: contactManagementApi.reducer,
      [newsApi.reducerPath]: newsApi.reducer,
      [guidesApi.reducerPath]: guidesApi.reducer,
      [gamesApi.reducerPath]: gamesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        newsletterApi.middleware,
        authApi.middleware,
        bonusesApi.middleware,
        casinosApi.middleware,
        usersApi.middleware,
        campaignsApi.middleware,
        contactApi.middleware,
        contactManagementApi.middleware,
        newsApi.middleware,
        guidesApi.middleware,
        gamesApi.middleware
      ),
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
