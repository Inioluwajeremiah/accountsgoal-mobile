import { NOTE_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const summaryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    remindMeLater: builder.mutation({
      query: (data) => ({
        url: `click-button/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),
    createSummary: builder.mutation({
      query: (data) => ({
        url: `create-summary`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),
    updateColor: builder.mutation({
      query: (data) => ({
        url: `update-color-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
  useRemindMeLaterMutation,
  useCreateSummaryMutation,
  useUpdateColorMutation,
} = summaryApiSlice;
