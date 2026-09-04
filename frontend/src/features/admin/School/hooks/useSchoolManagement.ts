import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectClasses,
  selectSections,
  selectSubjects,
  selectClassSubjects,
  selectSelectedClassId,
  selectSchoolLoading,
  selectSchoolSaving,
  selectSchoolError,
} from "../redux/schoolSelector";

import {
  attachSubjectThunk,
  createClassThunk,
  createSectionThunk,
  createSubjectThunk,
  deleteClassThunk,
  deleteSectionThunk,
  fetchClassesThunk,
  fetchClassSubjectsThunk,
  fetchSectionsThunk,
  fetchSubjectsThunk,
  removeClassSubjectThunk,
} from "../redux/schoolThunk";

import { setSelectedClassId } from "../redux/schoolSlice";

import type {
  AttachSubjectInput,
  NewClassInput,
  NewSectionInput,
} from "../types/schoolTypes";


const asMessage = (error: unknown): string =>
  typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "Something went wrong.";


export const useSchoolManagement = () => {
  const dispatch = useDispatch<AppDispatch>();


  const classes = useSelector(selectClasses);
  const sections = useSelector(selectSections);
  const subjects = useSelector(selectSubjects);
  const classSubjects = useSelector(selectClassSubjects);
  const selectedClassId = useSelector(selectSelectedClassId);
  const loading = useSelector(selectSchoolLoading);
  const saving = useSelector(selectSchoolSaving);
  const error = useSelector(selectSchoolError);


  const loadClasses = useCallback(() => {
    dispatch(fetchClassesThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const loadSections = useCallback(() => {
    dispatch(fetchSectionsThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  const loadSubjects = useCallback(() => {
    dispatch(fetchSubjectsThunk())
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [dispatch]);


  // Load base data on mount.


  useEffect(() => {
    loadClasses();
    loadSections();
    loadSubjects();
  }, [loadClasses, loadSections, loadSubjects]);


  // Load the selected class's subjects whenever the selection changes.



  useEffect(() => {
    if (!selectedClassId) {
      return;
    }

    dispatch(fetchClassSubjectsThunk(selectedClassId))
      .unwrap()
      .catch((err) => toast.error(asMessage(err)));
  }, [selectedClassId, dispatch]);


  // Auto-select the first class once classes are loaded so the panel below
  // always haves a class to manage sections and subjects for.



  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      dispatch(setSelectedClassId(classes[0].id));
    }
  }, [classes, selectedClassId, dispatch]);


  const selectClass = useCallback((id: string) => {
    dispatch(setSelectedClassId(id));
  }, [dispatch]);


  const reloadClassSubjects = useCallback(() => {
    if (selectedClassId) {
      dispatch(fetchClassSubjectsThunk(selectedClassId))
        .unwrap()
        .catch((err) => toast.error(asMessage(err)));
    }
  }, [selectedClassId, dispatch]);


  const handleCreateClass = useCallback(async (input: NewClassInput) => {
    try {
      const created = await dispatch(
        createClassThunk(input)
      ).unwrap();

      // Select the newly created class sa admin can immediately start adding sectionsand subjects.

      dispatch(setSelectedClassId(created.id));
      toast.success("Class added successfully.");

      return true;
    } catch (err) {
      toast.error(asMessage(err));

      return false;
    }
  }, [dispatch]);


  const handleDeleteClass = useCallback(async (id: string) => {
    try {
      await dispatch(deleteClassThunk(id)).unwrap();

      toast.success("Class removed.");
    } catch (err) {
      toast.error(asMessage(err));
    }
  }, [dispatch]);


  const handleCreateSection = useCallback(async (input: NewSectionInput) => {
    try {
      await dispatch(createSectionThunk(input)).unwrap();

      toast.success("Section added successfully.");

      return true;
    } catch (err) {
      toast.error(asMessage(err));

      return false;
    }
  }, [dispatch]);


  const handleDeleteSection = useCallback(async (id: string) => {
    try {
      await dispatch(deleteSectionThunk(id)).unwrap();

      toast.success("Section removed.");
    } catch (err) {
      toast.error(asMessage(err));
    }
  }, [dispatch]);


  const handleAttachSubject = useCallback(async (input: AttachSubjectInput) => {
    try {
      let subjectId = input.subject_id;

      // When the admin is creating a brand-new subject, create the master record first and then tie it to the class.


      if (input.newSubject) {
        const created = await dispatch(
          createSubjectThunk(input.newSubject)
        ).unwrap();

        subjectId = created.id;
      }

      await dispatch(
        attachSubjectThunk({
          class_id: input.class_id,
          subject_id: subjectId,
          is_compulsory: input.is_compulsory,
          weekly_periods: input.weekly_periods,
        })
      ).unwrap();

      toast.success("Subject added to class successfully.");

      return true;
    } catch (err) {
      toast.error(asMessage(err));

      return false;
    }
  }, [dispatch]);


  const handleRemoveClassSubject = useCallback(async (id: string) => {
    try {
      await dispatch(removeClassSubjectThunk(id)).unwrap();

      toast.success("Subject removed from class.");
    } catch (err) {
      toast.error(asMessage(err));
    }
  }, [dispatch]);


  return {
    classes,
    sections,
    subjects,
    classSubjects,
    selectedClassId,
    loading,
    saving,
    error,
    selectClass,
    reloadClassSubjects,
    loadClasses,
    handleCreateClass,
    handleDeleteClass,
    handleCreateSection,
    handleDeleteSection,
    handleAttachSubject,
    handleRemoveClassSubject,
  };
};