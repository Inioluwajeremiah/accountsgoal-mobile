import {
  FORGET_PASSWORD_URL,
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
  VERIFY_URL,
} from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${REGISTER_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${LOGIN_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    verify: builder.mutation({
      query: (data) => ({
        url: `${VERIFY_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // resend: builder.mutation({
    //   query: (data) => ({
    //     url: `${USER_URL}`,
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `${FORGET_PASSWORD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${LOGOUT_URL}`,
        method: "POST",
      }),
    }),
    // profile: builder.mutation({
    //   query: (data) => ({
    //     url: `${USER_URL}/profile`,
    //     method: "PUT",
    //     body: data,
    //   }),
    // }),
    // getUsers: builder.query({
    //   query: () => ({
    //     url: `${USER_URL}`,
    //   }),
    //   providesTags: ["Users"],
    //   keepUnusedDataFor: 5,
    // }),
    // deleteUser: builder.mutation({
    //   query: (userId) => ({
    //     url: `${USER_URL}/${userId}`,
    //     method: "DELETE",
    //   }),
    // }),
    // getUserDetails: builder.query({
    //   query: (userId) => ({
    //     url: `${USER_URL}/${userId}`,
    //   }),
    //   keepUnusedDataFor: 5,
    // }),
    // updateUser: builder.mutation({
    //   query: (data) => ({
    //     url: `${USER_URL}/${data.userId}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Users"],
    // }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useVerifyMutation,
  useResendMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = usersApiSlice;
