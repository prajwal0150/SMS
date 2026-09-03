import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectNotices,
  selectAnnouncements,
  selectEvents,
  selectCommunicationLoading,
  selectCommunicationSaving,
  selectCommunicationError,
} from "../redux/communicationSelector";

import {
  fetchNoticesThunk,
  createNoticeThunk,
  deleteNoticeThunk,
  fetchAnnouncementsThunk,
  createAnnouncementThunk,
  deleteAnnouncementThunk,
  fetchEventsThunk,
  createEventThunk,
  deleteEventThunk,
} from "../redux/communicationThunk";

import type {
  NewNoticeInput,
  NewAnnouncementInput,
  NewEventInput,
} from "../types/communicationTypes";


const asMessage = (error: unknown): string =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "Something went wrong.";


export const useCommunication = () => {

  const dispatch =
    useDispatch<AppDispatch>();


  const notices =
    useSelector(selectNotices);

  const announcements =
    useSelector(selectAnnouncements);

  const events =
    useSelector(selectEvents);

  const loading =
    useSelector(selectCommunicationLoading);

  const saving =
    useSelector(selectCommunicationSaving);

  const error =
    useSelector(selectCommunicationError);


  const loadNotices = useCallback(() => {
    dispatch(fetchNoticesThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadAnnouncements = useCallback(() => {
    dispatch(fetchAnnouncementsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadEvents = useCallback(() => {
    dispatch(fetchEventsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const handleCreateNotice = useCallback(
    async (input: NewNoticeInput) => {
      try {
        await dispatch(
          createNoticeThunk(input)
        ).unwrap();

        toast.success("Notice added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteNotice = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteNoticeThunk(id)
        ).unwrap();

        toast.success("Notice removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  const handleCreateAnnouncement = useCallback(
    async (input: NewAnnouncementInput) => {
      try {
        await dispatch(
          createAnnouncementThunk(input)
        ).unwrap();

        toast.success("Announcement added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteAnnouncement = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteAnnouncementThunk(id)
        ).unwrap();

        toast.success("Announcement removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  const handleCreateEvent = useCallback(
    async (input: NewEventInput) => {
      try {
        await dispatch(
          createEventThunk(input)
        ).unwrap();

        toast.success("Event added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteEvent = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteEventThunk(id)
        ).unwrap();

        toast.success("Event removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  return {
    notices,
    announcements,
    events,
    loading,
    saving,
    error,
    loadNotices,
    loadAnnouncements,
    loadEvents,
    handleCreateNotice,
    handleDeleteNotice,
    handleCreateAnnouncement,
    handleDeleteAnnouncement,
    handleCreateEvent,
    handleDeleteEvent,
  };
};
