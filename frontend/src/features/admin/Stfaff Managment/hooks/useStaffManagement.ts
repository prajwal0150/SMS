import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectTeachers,
  selectAssignments,
  selectAttendance,
  selectStaffLoading,
  selectStaffSaving,
  selectStaffError,
} from "../redux/staffManagmentSelector";

import {
  fetchTeachersThunk,
  createTeacherThunk,
  deleteTeacherThunk,
  fetchAssignmentsThunk,
  createAssignmentThunk,
  fetchAttendanceThunk,
  markAttendanceThunk,
} from "../redux/staffManagmentThunk";

import type {
  CreateTeacherInput,
  NewAssignmentInput,
  NewAttendanceInput,
} from "../types/staffManagmentTypes";


const asMessage = (error: unknown): string =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "Something went wrong.";


export const useStaffManagement = () => {

  const dispatch =
    useDispatch<AppDispatch>();


  const teachers =
    useSelector(selectTeachers);

  const assignments =
    useSelector(selectAssignments);

  const attendance =
    useSelector(selectAttendance);

  const loading =
    useSelector(selectStaffLoading);

  const saving =
    useSelector(selectStaffSaving);

  const error =
    useSelector(selectStaffError);


  const loadTeachers = useCallback(() => {
    dispatch(fetchTeachersThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadAssignments = useCallback(() => {
    dispatch(fetchAssignmentsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadAttendance = useCallback(() => {
    dispatch(fetchAttendanceThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const handleCreateTeacher = useCallback(
    async (input: CreateTeacherInput) => {
      try {
        await dispatch(
          createTeacherThunk(input)
        ).unwrap();

        toast.success(
          "Teacher added. Login created for their email."
        );

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteTeacher = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteTeacherThunk(id)).unwrap();

        toast.success("Teacher removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  const handleCreateAssignment = useCallback(
    async (input: NewAssignmentInput) => {
      try {
        await dispatch(
          createAssignmentThunk(input)
        ).unwrap();

        toast.success("Assignment created.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleMarkAttendance = useCallback(
    async (input: NewAttendanceInput) => {
      try {
        await dispatch(
          markAttendanceThunk(input)
        ).unwrap();

        toast.success("Attendance saved.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  return {
    teachers,
    assignments,
    attendance,
    loading,
    saving,
    error,
    loadTeachers,
    loadAssignments,
    loadAttendance,
    handleCreateTeacher,
    handleDeleteTeacher,
    handleCreateAssignment,
    handleMarkAttendance,
  };
};
