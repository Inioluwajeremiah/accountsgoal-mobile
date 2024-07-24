import { GOAL_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const goalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGoal: builder.mutation({
      query: (data) => ({
        url: `${GOAL_URL}createGoal/${data.uniqueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goal"],
    }),
    getAllGoals: builder.query({
      query: ({ user }) => ({
        url: `${GOAL_URL}getAllGoals/${user}`,
      }),
      transformResponse: (response) => {
        return response?.goals?.sort(
          (a, b) => new Date(a.endDate) - new Date(b.endDate)
        );
      },
      providesTags: ["Goal"],
      keepUnusedDataFor: 28800,
    }),

    getGoal: builder.query({
      query: ({ uniqueId }) => ({
        url: `${GOAL_URL}getGoalById/${uniqueId}`,
      }),
      transformResponse: (response) => {
        return response?.data?.goalId?.sort(
          (a, b) => new Date(a.endDate) - new Date(b.endDate)
        );
      },
      providesTags: ["Goal"],
      keepUnusedDataFor: 28800,
    }),
    editGoal: builder.mutation({
      query: (data) => ({
        url: `${GOAL_URL}editGoal/${data.uniqueId}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Goal"],
    }),
    deleteGoal: builder.mutation({
      query: ({ uniqueId, id }) => ({
        url: `${GOAL_URL}deleteGoal/${uniqueId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goal"],
    }),
    getColorStatus: builder.query({
      query: ({ userId, uniqueId }) => ({
        url: `${GOAL_URL}/color-status/${userId}?excelUniqueId=${uniqueId}`,
      }),
      providesTags: ["Goal"],
      keepUnusedDataFor: 28800,
    }),
  }),
});

export const {
  useCreateGoalMutation,
  useGetAllGoalsQuery,
  useGetGoalQuery,
  useEditGoalMutation,
  useDeleteGoalMutation,
  useGetColorStatusQuery,
} = goalApiSlice;
