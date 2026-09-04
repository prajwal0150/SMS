import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "../../../../redux/store";

import {
  selectClasses,
  selectClassSubjects,
  selectSections,
  selectSchoolLoading,
  selectSubjects,
} from "../redux/schoolSelector";

import {
  fetchClassesThunk,
  fetchClassSubjectsThunk,
  fetchSectionsThunk,
  fetchSubjectsThunk,
} from "../redux/schoolThunk";


/**
 * Shared lookup data from School Management (classes, sections, subjects).
 *
 * Use this anywhere a form needs class / section / subject dropdowns so
 * everything stays in sync with what the admin configured on the
 * School Management page.
 *
 * When a `classId` is provided the hook also loads that class's assigned
 * subjects (from `class_subjects`) so the caller can offer only the
 * subjects that actually belong to the class.
 */
export const useSchoolLookups = (classId?: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const classes = useSelector(selectClasses);
  const sections = useSelector(selectSections);
  const subjects = useSelector(selectSubjects);
  const classSubjects = useSelector(selectClassSubjects);
  const loading = useSelector(selectSchoolLoading);

  // Load the base School Management tables on mount.
  useEffect(() => {
    dispatch(fetchClassesThunk());
    dispatch(fetchSectionsThunk());
    dispatch(fetchSubjectsThunk());
  }, [dispatch]);

  // Load the assigned subjects whenever the selected class changes.
  useEffect(() => {
    if (classId) {
      dispatch(fetchClassSubjectsThunk(classId));
    }
  }, [dispatch, classId]);


  const classSections = classId
    ? sections.filter(
        (section) => section.class_id === classId
      )
    : [];


  // Subject names actually assigned to the class on the School Management page.
  const classSubjectNames = classId
    ? classSubjects
        .filter((entry) => entry.class_id === classId)
        .map((entry) => entry.subjects?.subject_name)
        .filter((name): name is string => Boolean(name))
        .sort()
    : [];


  return {
    classes,
    sections,
    subjects,
    classSubjects,
    classSections,
    classSubjectNames,
    loading,
  };
};