import { GOAL_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const goalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGoal: builder.mutation({
      query: (data) => ({
        url: `${GOAL_URL}createGoal`,
        method: "POST",
        body: data,
      }),
      providesTags: ["Goal"],
    }),
    getAllGoals: builder.query({
      query: ({ user }) => ({
        url: `${GOAL_URL}getAllGoals/${user}`,
      }),
      // providesTags: ["Goal"],
      keepUnusedDataFor: 5,
    }),

    getGoal: builder.query({
      query: (userId) => ({
        url: `${GOAL_URL}getGoalById/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    editGoal: builder.mutation({
      query: (data) => ({
        url: `${GOAL_URL}editGoal/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Goal"],
    }),
    deleteGoal: builder.mutation({
      query: ({ id }) => ({
        url: `${GOAL_URL}deleteGoal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Goal"],
    }),
  }),
});

export const {
  useCreateGoalMutation,
  useGetAllGoalsQuery,
  useGetGoalQuery,
  useEditGoalMutation,
  useDeleteGoalMutation,
} = goalApiSlice;
