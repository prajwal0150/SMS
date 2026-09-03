import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectStudents,
  selectPromotions,
  selectDocuments,
  selectStudentLoading,
  selectPromotionsLoading,
  selectDocumentsLoading,
  selectStudentSaving,
  selectStudentError,
} from "../redux/studentManagmentSelector";

import {
  fetchStudentsThunk,
  createStudentThunk,
  deleteStudentThunk,
  fetchPromotionsThunk,
  promoteStudentsThunk,
  fetchDocumentsThunk,
  createDocumentThunk,
  deleteDocumentThunk,
} from "../redux/studentManagmentThunk";

import type {
  NewStudentInput,
  PromotionInput,
  NewDocumentInput,
} from "../types/studentManagmentTypes";


const asMessage = (error: unknown): string =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "Something went wrong.";


export const useStudentManagement = () => {

  const dispatch =
    useDispatch<AppDispatch>();


  const students =
    useSelector(selectStudents);

  const promotions =
    useSelector(selectPromotions);

  const documents =
    useSelector(selectDocuments);

  const loading =
    useSelector(selectStudentLoading);

  const promotionsLoading =
    useSelector(selectPromotionsLoading);

  const documentsLoading =
    useSelector(selectDocumentsLoading);

  const saving =
    useSelector(selectStudentSaving);

  const error =
    useSelector(selectStudentError);


  const loadStudents = useCallback(() => {
    dispatch(fetchStudentsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadPromotions = useCallback(() => {
    dispatch(fetchPromotionsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const loadDocuments = useCallback(() => {
    dispatch(fetchDocumentsThunk())
      .unwrap()
      .catch((err) =>
        toast.error(asMessage(err))
      );
  }, [dispatch]);


  const handleCreateStudent = useCallback(
    async (input: NewStudentInput) => {
      try {
        await dispatch(
          createStudentThunk(input)
        ).unwrap();

        toast.success("Student added successfully.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteStudent = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteStudentThunk(id)
        ).unwrap();

        toast.success("Student removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  const handlePromoteStudents = useCallback(
    async (input: PromotionInput) => {
      try {
        await dispatch(
          promoteStudentsThunk(input)
        ).unwrap();

        toast.success(
          `${input.student_ids.length} student(s) promoted to ${input.class_name}.`
        );

        loadPromotions();

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch, loadPromotions]
  );


  const handleCreateDocument = useCallback(
    async (input: NewDocumentInput) => {
      try {
        await dispatch(
          createDocumentThunk(input)
        ).unwrap();

        toast.success("Document added.");

        return true;
      } catch (err) {
        toast.error(asMessage(err));

        return false;
      }
    },
    [dispatch]
  );


  const handleDeleteDocument = useCallback(
    async (id: string) => {
      try {
        await dispatch(
          deleteDocumentThunk(id)
        ).unwrap();

        toast.success("Document removed.");
      } catch (err) {
        toast.error(asMessage(err));
      }
    },
    [dispatch]
  );


  return {
    students,
    promotions,
    documents,
    loading,
    promotionsLoading,
    documentsLoading,
    saving,
    error,
    loadStudents,
    loadPromotions,
    loadDocuments,
    handleCreateStudent,
    handleDeleteStudent,
    handlePromoteStudents,
    handleCreateDocument,
    handleDeleteDocument,
  };
};