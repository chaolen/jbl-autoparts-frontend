import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import { skusApi } from "store/apis/skusApi";
import { userApi } from "./apis/userApi";
import { productsApi } from "./apis/productsApi";
import { adminApi } from "./apis/adminApi";
import { transactionsApi } from "./apis/transactionsApi";
import rootReducer from "./root-reducer";
import { clearSession } from "./slices/userSlice";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: clearSession,
  effect: async (action, listenerApi) => {
    localStorage.clear();
    persistor.purge();
    window.location.href = "/"; 
  },
});

const middlewares: any[] = [];

middlewares.push(adminApi.middleware);
middlewares.push(skusApi.middleware);
middlewares.push(userApi.middleware);
middlewares.push(productsApi.middleware);
middlewares.push(transactionsApi.middleware);
middlewares.push(listenerMiddleware.middleware);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(middlewares),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
