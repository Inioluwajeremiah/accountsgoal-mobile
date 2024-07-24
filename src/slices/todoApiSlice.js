import { TODO_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const todoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTodo: builder.mutation({
      query: (data) => ({
        url: `${TODO_URL}createTodoList/${data.uniqueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    getUserTodos: builder.query({
      query: (userId) => ({
        url: `${TODO_URL}getAllTodoList/${userId}`,
      }),
      transformResponse: (response) => {
        // Sort the response data in descending order
        // console.log("response transform ==>", response);
        return response.todos.sort(
          (a, b) => new Date(a.endDate) - new Date(b.endDate)
        );
      },
      providesTags: ["Todo"],
      keepUnusedDataFor: 28800,
    }),
    getTodoListById: builder.query({
      query: ({ uniqueId }) => ({
        url: `${TODO_URL}getTodoListById/${uniqueId}`,
      }),
      transformResponse: (response) => {
        // Sort the response data in descending order
        // console.log("response transform ==>", response);
        return response.data.todoId.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      },
      providesTags: ["Todo"],
      keepUnusedDataFor: 28800,
    }),

    getAllTodo: builder.query({
      query: () => ({
        url: `${TODO_URL}getAllTodoList`,
      }),
      providesTags: ["Todo"],
      keepUnusedDataFor: 28800,
    }),

    getTodo: builder.query({
      query: (userId) => ({
        url: `${TODO_URL}getTodoListById/${userId}`,
      }),
      providesTags: ["Todo"],
      keepUnusedDataFor: 28800,
    }),
    editTodo: builder.mutation({
      query: (data) => ({
        url: `${TODO_URL}editTodoList/${data.uniqueId}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation({
      query: ({ uniqueId, id }) => ({
        url: `${TODO_URL}deleteTodoList/${uniqueId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
    completeTodo: builder.mutation({
      query: (data) => ({
        url: `${TODO_URL}completedTodo/${data.uniqueId}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    searchTodo: builder.query({
      query: ({ keyword }) => ({
        url: `${TODO_URL}getTodoByEventName/${keyword}`,
      }),
      providesTags: ["Todo"],
      keepUnusedDataFor: 28800,
    }),
    filterTodo: builder.query({
      query: ({ keyword }) => ({
        url: `${TODO_URL}getTodoByPirority/${keyword}`,
      }),
      providesTags: ["Todo"],
      keepUnusedDataFor: 28800,
    }),
  }),
});

export const {
  useCreateTodoMutation,
  useGetUserTodosQuery,
  useGetTodoListByIdQuery,
  useGetAllTodoQuery,
  useGetTodoQuery,
  useEditTodoMutation,
  useDeleteTodoMutation,
  useCompleteTodoMutation,
  useSearchTodoQuery,
  useFilterTodoQuery,
} = todoApiSlice;
