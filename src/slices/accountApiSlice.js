import { BASE_URL, EVENT_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExcelData: builder.query({
      query: ({ userId }) => ({
        url: `${BASE_URL}getexcelData/${userId}`,
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDk2ZTUwMmE2ZDM4Y2I0YTBiNGZjZSIsImlhdCI6MTcxMzg5MTIyOSwiZXhwIjoxNzEzOTc3NjI5fQ.i73IhKL82gSoVIN_QOs6uJ31aP9e4Q0nr9UrfVAan78`,
        },
      }),
      // transformResponse: (response) => {
      //   // Sort the response data in descending order
      //   console.log("response transform ==>", response);
      //   return response.events.sort(
      //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      //   );
      // },
      providesTags: ["Account"],
      keepUnusedDataFor: 5,
    }),

    getAllExcelData: builder.query({
      query: () => ({
        url: `${BASE_URL}getAllexcelData`,
      }),
      providesTags: ["Event"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetExcelDataQuery, useGetAllExcelDataQuery } =
  accountApiSlice;
