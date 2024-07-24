import {
  ALL_USERS,
  FORGET_PASSWORD_URL,
  LOGIN_URL,
  LOGOUT_URL,
  PASSWORD_RESET_URL,
  REGISTER_URL,
  RESEND_OTP_URL,
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
    resendOtp: builder.mutation({
      query: (data) => ({
        url: `${RESEND_OTP_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: `${FORGET_PASSWORD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `verify-reset-password`,
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

    getAllUsers: builder.query({
      query: () => ({
        url: `${ALL_USERS}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: "updateuser/",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "updatepassword/",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResendOtpMutation,
  useForgetPasswordMutation,
  useVerifyMutation,
  useResetPasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = usersApiSlice;
