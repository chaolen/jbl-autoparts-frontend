import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuthHandler } from "../rtk-base-query";
import { GetMyTransactionsStatisticsResponse, SalesStatistics, Transaction } from "types/transaction";

type CartItem = {
  _id?: string;
  count?: number;
}

type CreateTransactionRequest = {
  items: CartItem[],
  cashier: string,
  total: number,
  discount: number,
  status: string,
  partsman?: string
}

type UpdateTransactionRequest = {
  items?: CartItem[],
  cashier?: string,
  total?: number,
  discount?: number,
  status?: string,
  partsman?: string
}

type GetMyTransactionResponse = {
  data: Transaction[];
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  }
}

type CancelTransactionResponse = {
  status: string,
  message: string;
}

type GetTransactionResponse = {
  data: {
    transactions: Transaction[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }
}

type GetAllTransactionResponse = {
  data: Transaction[];
}

type GetTransactionRequest = {
  page: number;
  search?: string;
  limit: number;
}

type GetMyTransactionRequest = {
  isAdmin?: boolean;
  page: number;
  limit: number;
  search?: string;
}

type GetSalesStatisticsResponse = {
  data: SalesStatistics
}

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: baseQueryWithAuthHandler,
  endpoints: (builder) => ({
    createTransaction: builder.mutation<any, CreateTransactionRequest>({
      query: (request) => ({
        url: "api/v1/transactions",
        method: "POST",
        body: request,
      }),
    }),
    updateTransaction: builder.mutation<any, { payload: UpdateTransactionRequest, id: string }>({
      query: ({ id, payload }) => ({
        url: `api/v1/transactions/${id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    cancelTransaction: builder.mutation<CancelTransactionResponse, string>({
      query: (transactionId) => ({
        url: `api/v1/transactions/cancel/${transactionId}`,
        method: "PATCH",
      }),
    }),
    returnTransaction: builder.mutation<CancelTransactionResponse, string>({
      query: (transactionId) => ({
        url: `api/v1/transactions/return/${transactionId}`,
        method: "PATCH",
      }),
    }),
    getMyTransactions: builder.query<GetMyTransactionResponse, GetMyTransactionRequest>({
      query: ({ isAdmin, limit, page, search }) => ({
        url: `api/v1/transactions/my-transactions?isAdmin=${isAdmin}&page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
    }),
    getMyStatistics: builder.query<GetMyTransactionsStatisticsResponse, void>({
      query: () => ({
        url: "api/v1/transactions/statistics",
        method: "GET",
      }),
    }),
    getTransactions: builder.query<GetTransactionResponse, GetTransactionRequest>({
      query: ({ limit, page, search }) => ({
        url: `api/v1/transactions?page=${page + 1}&limit=${limit}&search=${search}`,
        method: "GET"
      })
    }),
    getAllTransactions: builder.query<GetAllTransactionResponse, void>({
      query: () => ({
        url: 'api/v1/transactions/all-transactions',
        method: "GET"
      })
    }),
    getSalesStatistics: builder.query<GetSalesStatisticsResponse, void>({
      query: () => ({
        url: "api/v1/transactions/sales-statistics",
        method: "GET",
      }),
    })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateTransactionMutation,
  useLazyGetMyTransactionsQuery,
  useLazyGetMyStatisticsQuery,
  useCancelTransactionMutation,
  useUpdateTransactionMutation,
  useLazyGetTransactionsQuery,
  useLazyGetSalesStatisticsQuery,
  useReturnTransactionMutation,
  useLazyGetAllTransactionsQuery,
} = transactionsApi;
