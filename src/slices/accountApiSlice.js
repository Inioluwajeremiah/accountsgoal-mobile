import { BASE_URL, EVENT_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExcelData: builder.query({
      query: ({ userId }) => ({
        url: `${BASE_URL}getexcelData/${userId}`,
      }),
      // transformResponse: (response) => {
      //   // Sort the response data in descending order
      //   console.log("response transform ==>", response);
      //   return response.events.sort(
      //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      //   );
      // },
      providesTags: ["Account", "Goal"],
      keepUnusedDataFor: 28800,
    }),

    getAllExcelData: builder.query({
      query: () => ({
        url: `${BASE_URL}getAllexcelData`,
      }),
      providesTags: ["Account", "Goal"],
      keepUnusedDataFor: 28800,
    }),
  }),
});

export const { useGetExcelDataQuery, useGetAllExcelDataQuery } =
  accountApiSlice;
