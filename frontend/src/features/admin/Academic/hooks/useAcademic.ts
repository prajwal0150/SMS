import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectExams,
  selectTimetable,
  selectHolidays,
  selectAcademicLoading,
  selectAcademicSaving,
  selectAcademicError,
} from "../redux/academicSelector";

import {
  fetchExamsThunk,
  createExamThunk,
  deleteExamThunk,
  fetchTimetableThunk,
  createTimetableEntryThunk,
  deleteTimetableEntryThunk,
  fetchHolidaysThunk,
  createHolidayThunk,
  deleteHolidayThunk,
} from "../redux/academicThunk";

import type {
  NewExamInput,
  NewTimetableEntryInput,
  NewHolidayInput,
} from "../types/academicTypes";


const asMessage = (error: unknown): string =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "Something went wrong.";


export const useAcademic = () => {

  const dispatch =
    useDispatch<AppDispatch>();


  const exams =
    useSelector(selectExams);

  const timetable =
    useSelector(selectTimetable);

  const holidays =
    useSelector(selectHolidays);

  const loading =
    useSelector(selectAcademicLoading);

  const saving =
    useSelector(selectAcademicSaving);

  const error =
    useSelector(selectAcademicError);


  const loadExams = useCallback(() => {
    dispatch(fetchExamsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadTimetable = useCallback(() => {
    dispatch(fetchTimetableThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadHolidays = useCallback(() => {
    dispatch(fetchHolidaysThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const handleCreateExam = useCallback(
    async (input: NewExamInput) => {
      try {
        await dispatch(
          createExamThunk(input)
        ).unwrap();

        toast.success("Exam added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteExam = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteExamThunk(id)
        ).unwrap();

        toast.success("Exam removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  const handleCreateTimetableEntry = useCallback(
    async (input: NewTimetableEntryInput) => {
      try {
        await dispatch(
          createTimetableEntryThunk(input)
        ).unwrap();

        toast.success("Timetable entry added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteTimetableEntry = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteTimetableEntryThunk(id)
        ).unwrap();

        toast.success("Timetable entry removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  const handleCreateHoliday = useCallback(
    async (input: NewHolidayInput) => {
      try {
        await dispatch(
          createHolidayThunk(input)
        ).unwrap();

        toast.success("Holiday added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteHoliday = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteHolidayThunk(id)
        ).unwrap();

        toast.success("Holiday removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  return {
    exams,
    timetable,
    holidays,
    loading,
    saving,
    error,
    loadExams,
    loadTimetable,
    loadHolidays,
    handleCreateExam,
    handleDeleteExam,
    handleCreateTimetableEntry,
    handleDeleteTimetableEntry,
    handleCreateHoliday,
    handleDeleteHoliday,
  };
};