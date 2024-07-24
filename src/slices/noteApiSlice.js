import { uniqueId } from "lodash";
import { NOTE_URL } from "../utils/Endpoints";
import { apiSlice } from "./createApiSlice";

export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    attachImage: builder.mutation({
      query: (data) => ({
        url: `${NOTE_URL}attachimage/${data.uniqueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    sendAudio: builder.mutation({
      query: (data) => ({
        url: `${NOTE_URL}sendaudio/${data.uniqueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    addText: builder.mutation({
      query: (data) => ({
        url: `${NOTE_URL}addtext/${data.uniqueId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Note"],
    }),
    gwtAllNotes: builder.query({
      query: ({ userId }) => ({
        url: `${NOTE_URL}getallnotes/${userId}`,
      }),
      providesTags: ["Note"],
      keepUnusedDataFor: 28800,
    }),
    getAllNotesByUniqueId: builder.query({
      query: ({ userId, uniqueId }) => ({
        url: `${NOTE_URL}getnotebyid/${userId}/${uniqueId}`,
      }),
      providesTags: ["Note"],
      keepUnusedDataFor: 28800,
    }),

    deleteImage: builder.mutation({
      query: ({ uniqueId, id }) => ({
        url: `${NOTE_URL}deleteimage/${uniqueId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Note"],
    }),
    deleteAudio: builder.mutation({
      query: ({ uniqueId, id }) => ({
        url: `${NOTE_URL}deleteaudio/${uniqueId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Note"],
    }),
    deleteText: builder.mutation({
      query: ({ uniqueId, id }) => ({
        url: `${NOTE_URL}deletetext/${uniqueId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Note"],
    }),
    updateNote: builder.mutation({
      query: ({ uniqueId, noteId, text }) => ({
        url: `${NOTE_URL}updatenote/${uniqueId}/${noteId}`,
        method: "PUT",
        body: { text: text },
      }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useAddTextMutation,
  useAttachImageMutation,
  useSendAudioMutation,
  useDeleteAudioMutation,
  useDeleteImageMutation,
  useDeleteTextMutation,
  useGwtAllNotesQuery,
  useGetAllNotesByUniqueIdQuery,
  useUpdateNoteMutation,
} = noteApiSlice;
