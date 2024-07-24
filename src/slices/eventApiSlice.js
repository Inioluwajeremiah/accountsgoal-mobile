import { EVENT_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}/createEvent`,
        method: "POST",
        body: data,
      }),
      providesTags: ["Event"],
    }),
    getUserEvents: builder.query({
      query: ({ userId }) => ({
        url: `${EVENT_URL}getAllEvent/${userId}`,
      }),
      transformResponse: (response) => {
        // Sort the response data in descending order
        // console.log("response transform ==>", response);
        return response.events.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      },

      providesTags: ["Event"],
      keepUnusedDataFor: 5,
    }),

    getAllEvent: builder.query({
      query: () => ({
        url: `${EVENT_URL}getAllEventList`,
      }),
      providesTags: ["Event"],
      keepUnusedDataFor: 5,
    }),

    getEvent: builder.query({
      query: (userId) => ({
        url: `${EVENT_URL}getEventListById/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    editEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}editEvent/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
    deleteEvent: builder.mutation({
      query: ({ id }) => ({
        url: `${EVENT_URL}deleteEvent/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Event"],
    }),
    completeEvent: builder.mutation({
      query: (data) => ({
        url: `${EVENT_URL}completedEvent/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Event"],
    }),
    searchEvent: builder.query({
      query: ({ keyword }) => ({
        url: `${EVENT_URL}getEventByEventName/${keyword}`,
      }),
      keepUnusedDataFor: 5,
    }),
    filterEvent: builder.query({
      query: ({ keyword }) => ({
        url: `${EVENT_URL}getEventByPirority/${keyword}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetUserEventsQuery,
  useGetAllEventQuery,
  useGetEventQuery,
  useEditEventMutation,
  useDeleteEventMutation,
  useCompleteEventMutation,
  useSearchEventQuery,
  useFilterEventQuery,
} = eventApiSlice;
