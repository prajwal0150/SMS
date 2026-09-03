import { supabase } from "../../../../lib/supabase";

import type {
  Notice,
  NewNoticeInput,
  Announcement,
  NewAnnouncementInput,
  SchoolEvent,
  NewEventInput,
} from "../types/communicationTypes";


const getCurrentUserId = async (): Promise<string | undefined> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
};


// ==============================
// NOTICES
// ==============================

export const fetchNotices =
  async (): Promise<Notice[]> => {
    const { data, error } =
      await supabase
        .from("notices")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Notice[];
  };


export const createNotice = async (
  input: NewNoticeInput
): Promise<Notice> => {
  const createdBy = await getCurrentUserId();

  const { data, error } =
    await supabase
      .from("notices")
      .insert({ ...input, created_by: createdBy ?? null })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Notice;
};


export const deleteNotice = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("notices")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// ANNOUNCEMENTS
// ==============================

export const fetchAnnouncements =
  async (): Promise<Announcement[]> => {
    const { data, error } =
      await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as Announcement[];
  };


export const createAnnouncement = async (
  input: NewAnnouncementInput
): Promise<Announcement> => {
  const createdBy = await getCurrentUserId();

  const { data, error } =
    await supabase
      .from("announcements")
      .insert({ ...input, created_by: createdBy ?? null })
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Announcement;
};


export const deleteAnnouncement = async (
  id: string
): Promise<void> => {
  const { error } =
    await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};


// ==============================
// EVENTS
// ==============================

export const fetchEvents =
  async (): Promise<SchoolEvent[]> => {
    const { data, error } =
      await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as SchoolEvent[];
  };


export const createEvent = async (
  input: NewEventInput
): Promise<SchoolEvent> => {
  const createdBy = await getCurrentUserId();

  const { data, error } =
    await supabase
      .from("events")
      .insert({ ...input, created_by: createdBy ?? null })
      .select()
      .single();



  if (error) {
    throw new Error(error.message);
  }



  return data as SchoolEvent;
};


export const deleteEvent = async (
  id: string
): Promise<void> => {
  const { error } =



    await supabase
      .from("events")
      .delete()
      .eq("id", id);



  if (error) {
    throw new Error(error.message);
  }
};