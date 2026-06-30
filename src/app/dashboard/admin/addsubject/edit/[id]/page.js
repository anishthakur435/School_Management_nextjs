"use client";
import FormField from "@/components/reusable/reusableForm";
import ReusableModal from "@/components/reusable/reusableModal";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

const schema = Yup.object().shape({
  subjectname: Yup.string().required("Subject name is required").trim(),
  subjectcode: Yup.string().required("Code is required").trim(),
});

export default function EditSubject() {
  const router = useRouter();
  const { id } = useParams();

  const [subjects, setSubjects] = useLocalStorage("subjects", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      subjectname: "",
      subjectcode: "",
    },
  });

  const EditSubjectField = (editSubjectData) => {
    try {
      const oldSubject = subjects.find((subj) => subj.id == id);

      if (!oldSubject) {
        toastMessage("Subject not found.", "error");
        return;
      }

      const normalizedName = editSubjectData.subjectname.trim().toLowerCase();
      const normalizedCode = editSubjectData.subjectcode.trim().toLowerCase();

      const duplicateName = subjects.find(
        (subj) =>
          subj.id != id &&
          subj.subjectname.trim().toLowerCase() === normalizedName,
      );

      if (duplicateName) {
        toastMessage("A subject with this name already exists", "error");
        return;
      }

      const duplicateCode = subjects.find(
        (subj) =>
          subj.id != id &&
          subj.subjectcode.trim().toLowerCase() === normalizedCode,
      );

      if (duplicateCode) {
        toastMessage("This subject code is already in use", "error");
        return;
      }

      const newSubjectName = editSubjectData.subjectname.trim();
      const newSubjectCode = editSubjectData.subjectcode.trim();

      const updatedSubjectsList = subjects.map((subj) => {
        if (subj.id == id) {
          return {
            ...subj,
            subjectname: newSubjectName,
            subjectcode: newSubjectCode,
          };
        }
        return subj;
      });

      if (oldSubject.subjectname !== newSubjectName) {
        const updatedCourses = assignedCourses.map((course) => {
          if (course.subjectname === oldSubject.subjectname) {
            return { ...course, subjectname: newSubjectName };
          }
          return course;
        });
        setAssignedCourses(updatedCourses);
      }

      setSubjects(updatedSubjectsList);
      toastMessage("Subject updated successfully!", "success");

      reset();
      router.replace("/dashboard/admin");
    } catch (error) {
      console.error(error);
      toastMessage("Error updating subject", "error");
    }
  };

  useEffect(() => {
    if (id) {
      const findSubjectID = subjects.find((subj) => subj.id == id);
      if (findSubjectID) {
        reset({
          subjectname: findSubjectID.subjectname,
          subjectcode: findSubjectID.subjectcode,
        });
      }
    }
  }, [id, subjects, reset]);

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
      <Paper
        elevation={4}
        className="w-full max-w-md rounded-3xl p-8 shadow-xl"
      >
        <Box className="text-center mb-6">
          <Typography
            variant="h4"
            className="font-bold text-gray-800 tracking-wide"
          >
            {" "}
            Edit Subject{" "}
          </Typography>
        </Box>
        <form
          onSubmit={handleSubmit(EditSubjectField)}
          className="flex flex-col gap-5"
        >
          <FormField
            name="subjectname"
            placeholder="e.g. CHEMISTRY"
            label="Subject Name"
            type="text"
            control={control}
          />

          <FormField
            name="subjectcode"
            placeholder="e.g. CHEM-101"
            label="Subject Code"
            type="text"
            control={control}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Update Subject
          </Button>
          <Button
            className="rounded-xl py-3 font-semibold"
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
