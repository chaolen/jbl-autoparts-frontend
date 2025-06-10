import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuthHandler } from '../rtk-base-query'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    adminCheck: builder.query<any, void>({
      query: () => ({
        url: 'initialize/admin',
        method: 'GET',
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLazyAdminCheckQuery } = adminApi;