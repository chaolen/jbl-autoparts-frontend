import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { clearSession } from "./slices/userSlice";

const apiURL = process.env.REACT_APP_API_BASE_URL;

const rawBaseQueryWithAuthHandler = fetchBaseQuery({
  baseUrl: apiURL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).user.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuthHandler: BaseQueryFn<any, unknown, unknown> = async (args, api, extraOptions) => {
  const result = await rawBaseQueryWithAuthHandler(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearSession());
  }

  return result;
};

export const baseQuery = fetchBaseQuery({
  baseUrl: apiURL,
});
