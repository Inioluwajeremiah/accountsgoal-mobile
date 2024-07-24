import { ORGANIZATION_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (data) => ({
        url: `create_organization/${data.user}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),
    createOrganizationAndSkipInviteMutation: builder.mutation({
      query: (data) => ({
        url: `create_organizationandskipinvite/${data.user}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    getAllOrganizations: builder.query({
      query: () => ({
        url: `${ORGANIZATION_URL}getAllOrganizations`,
      }),
      providesTags: ["Organization"],
      keepUnusedDataFor: 28800,
    }),

    getAnOrganization: builder.query({
      query: ({ userId }) => ({
        url: `getOrganization/${userId}`,
      }),
      providesTags: ["Organization"],
      keepUnusedDataFor: 28800,
    }),
    updateOrganization: builder.mutation({
      query: (data) => ({
        url: `updateOrganization/${data.orgId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),
    deleteOrganization: builder.mutation({
      query: (userId) => ({
        url: `${ORGANIZATION_URL}deleteTodoList/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
    deactivateOrganization: builder.mutation({
      query: ({ userId }) => ({
        url: `${ORGANIZATION_URL}disable-organization/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),
    leaveOrganization: builder.mutation({
      query: (body) => ({
        url: `${ORGANIZATION_URL}leaveOrganization`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Organization"],
    }),
    removeUserFromOrganization: builder.mutation({
      query: (body) => ({
        url: `${ORGANIZATION_URL}removeUserFromOrganization/${body.userId}`,
        method: "DELETE",
        body: body.userEmail,
      }),
      invalidatesTags: ["Organization"],
    }),
    remindUser: builder.mutation({
      query: (body) => ({
        url: `remindUser/${body.organizationId}/${body.userId}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Organization"],
    }),
    addMember: builder.mutation({
      query: (body) => ({
        url: `${ORGANIZATION_URL}create-invite/${body.organizationId}/${body.userId}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Organization"],
    }),
    registerInvitedUser: builder.mutation({
      query: (body) => ({
        url: `register-user-under-organization/${body.organizationId}/${body.userId}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Organization"],
    }),
    getUserUnderOrganizations: builder.query({
      query: ({ organizationId, userId, invitedUserId }) => ({
        url: `getuser-under-organization/${organizationId}/${userId}/${invitedUserId}`,
      }),
      providesTags: ["Organization"],
      keepUnusedDataFor: 28800,
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useCreateOrganizationAndSkipInviteMutationMutation,
  useUpdateOrganizationMutation,
  useGetAnOrganizationQuery,
  useDeactivateOrganizationMutation,
  useLeaveOrganizationMutation,
  useRemindUserMutation,
  useRemoveUserFromOrganizationMutation,
  useAddMemberMutation,
  useRegisterInvitedUserMutation,
  useGetUserUnderOrganizationsQuery,
} = organizationApiSlice;
