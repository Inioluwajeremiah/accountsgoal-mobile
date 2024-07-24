import { BASE_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const emailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendEmailData: builder.mutation({
      query: (data) => ({
        url: `send-email`,
        method: "POST",
        body: data,
      }),
    }),
    sendGreetingEmail: builder.mutation({
      query: (data) => ({
        url: `send-greet`,
        method: "POST",
        body: data,
      }),
    }),
    getEmailData: builder.query({
      query: ({ userId }) => ({
        url: `getAllEmails/${userId}`,
      }),
      providesTags: ["GoalEmail"],
      keepUnusedDataFor: 28800,
    }),
    updateEmailData: builder.mutation({
      query: (data) => ({
        url: `update-email-content/${data.emailId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["GoalEmail"],
    }),
    getAllGreetings: builder.query({
      query: () => ({
        url: `getAllGreetings/`,
      }),
      providesTags: ["ActivityEmail"],
      keepUnusedDataFor: 28800,
    }),
  }),
});

export const {
  useSendEmailDataMutation,
  useSendGreetingEmailMutation,
  useGetEmailDataQuery,
  useUpdateEmailDataMutation,
  useGetAllGreetingsQuery,
} = emailApiSlice;
