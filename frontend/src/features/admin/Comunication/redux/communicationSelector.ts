import type { RootState } from "../../../../redux/store";


export const selectCommunication = (
  state: RootState
) => state.communication;


export const selectNotices = (
  state: RootState
) => state.communication.notices;


export const selectAnnouncements = (
  state: RootState
) => state.communication.announcements;


export const selectEvents = (
  state: RootState
) => state.communication.events;


export const selectCommunicationLoading = (
  state: RootState
) => state.communication.loading;


export const selectCommunicationSaving = (
  state: RootState
) => state.communication.saving;


export const selectCommunicationError = (
  state: RootState
) => state.communication.error;