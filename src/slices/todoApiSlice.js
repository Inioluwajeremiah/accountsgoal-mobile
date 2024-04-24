import { TODO_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const todoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTodo: builder.mutation({
      query: (data) => ({
        url: `${TODO_URL}createTodoList`,
        method: "POST",
        body: data,
      }),
      providesTags: ["Todo"],
    }),
    getUserTodos: builder.query({
      query: (userId) => ({
        url: `${TODO_URL}getAllTodoList/${userId}`,
      }),
      transformResponse: (response) => {
        // Sort the response data in descending order
        console.log("response transform ==>", response);
        return response.todos.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      },

      // providesTags: ["Todo"],
      keepUnusedDataFor: 5,
    }),

    getAllTodo: builder.query({
      query: () => ({
        url: `${TODO_URL}getAllTodoList`,
      }),
      keepUnusedDataFor: 5,
    }),

    getTodo: builder.query({
      query: (userId) => ({
        url: `${TODO_URL}getTodoListById/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    editTodo: builder.mutation({
      query: (data) => ({
        url: `${TODO_URL}editTodoList/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `${TODO_URL}deleteTodoList/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
    completeTodo: builder.mutation({
      query: (data) => ({
        url: `${TODO_URL}completedTodo/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    searchTodo: builder.query({
      query: ({ keyword }) => ({
        url: `${TODO_URL}getTodoByEventName/${keyword}`,
      }),
      keepUnusedDataFor: 5,
    }),
    filterTodo: builder.query({
      query: ({ keyword }) => ({
        url: `${TODO_URL}getTodoByPirority/${keyword}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateTodoMutation,
  useGetUserTodosQuery,
  useGetAllTodoQuery,
  useGetTodoQuery,
  useEditTodoMutation,
  useDeleteTodoMutation,
  useCompleteTodoMutation,
  useSearchTodoQuery,
  useFilterTodoQuery,
} = todoApiSlice;
