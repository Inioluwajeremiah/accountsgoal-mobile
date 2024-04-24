import { ORGANIZATION_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (data) => ({
        url: `create_organization`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
    }),
    createOrganizationAndSkipInviteMutation: builder.mutation({
      query: (data) => ({
        url: `create_organizationandskipinvite`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: data,
      }),
    }),

    getAllOrganizations: builder.query({
      query: () => ({
        url: `${ORGANIZATION_URL}getAllOrganizations`,
      }),
      // providesTags: ["Organization"],
      keepUnusedDataFor: 5,
    }),

    getAnOrganization: builder.query({
      query: (userId) => ({
        url: `${ORGANIZATION_URL}getOrganization/${userId}`,
      }),
      keepUnusedDataFor: 5,
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
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useCreateOrganizationAndSkipInviteMutationMutation,
  useUpdateOrganizationMutation,
} = organizationApiSlice;
