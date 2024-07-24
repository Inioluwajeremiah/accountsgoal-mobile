import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/Endpoints";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Account",
    "ActivityEmail",
    "Event",
    "Goal",
    "GoalEmail",
    "Interaction",
    "Note",
    "Organization",
    "User",
    "Todo",
  ],
  endpoints: (builder) => ({}),
});
