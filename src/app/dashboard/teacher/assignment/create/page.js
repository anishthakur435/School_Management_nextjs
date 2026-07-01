"use client";

import React, { useEffect } from "react";
import { Box, Container, Grid, Typography, Paper, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

import FormField from "@/components/reusable/reusableForm";
import FormSelect from "@/components/reusable/ResuableSelect";
import { toastMessage } from "@/components/reusable/reusableToast";

const schema = Yup.object().shape({
  title: Yup.string().required("Assignment title is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  classAssigned: Yup.string().required("Class is required"),
  course: Yup.string().required("Course/Subject is required"),
  dueDate: Yup.date()
    .required("Due date is required")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Date must be in the future.",
    ),
});

export default function TeacherAssignmentPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [userData] = useLocalStorage("userData", []);
  const [createdClass] = useLocalStorage("createdClass", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [assignments, setAssignments] = useLocalStorage("assignments", []);

  const findTeacher = userData?.find(
    (teacher) => String(teacher.id) === String(session?.user?.id),
  );

  //   find all the subjects taught by teacher
  const findTeacherCourse = assignedCourses?.filter(
    (course) => course.teacher === findTeacher?.name,
  );

  //
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      classAssigned: "",
      course: "",
      dueDate: "",
    },
  });

  //   get selected course from field
  const getCourseName = watch("course");

  const subjectClass = findTeacherCourse?.filter(
    (course) => course.subjectname === getCourseName,
  );

  //
  const handleAssign = (data) => {
    try {
      if (!findTeacher) {
        return toastMessage("Teacher profile not found!", "error");
      }
      const duplicateAssignment = assignments?.find(
        (assignment) =>
          assignment.title === data.title &&
          assignment.classname === data.classAssigned &&
          assignment.subjectname === data.course,
      );

      if (duplicateAssignment) {
        return toastMessage(
          "Assignment already exists for this class and subject.",
          "error",
        );
      }
      const isValidCourse = findTeacherCourse?.find(
        (course) =>
          course.subjectname === data.course &&
          course.classname === data.classAssigned,
      );

      if (!isValidCourse) {
        return toastMessage("Invalid course or class selection.", "error");
      }
      const findAssignedCourses = assignedCourses?.find(
        (course) =>
          course.subjectname === data.course &&
          course.classname === data.classAssigned &&
          course.teacher === findTeacher?.name,
      );
      if (!findAssignedCourses) {
        return toastMessage(
          "You are not assigned to this subject/class.",
          "error",
        );
      }

      const newAssignment = {
        id: Date.now(),
        teacherId: findTeacher.id,
        teacherName: findTeacher.name,
        title: data.title,
        subjectCode: findAssignedCourses.subjectcode,
        description: data.description,
        classname: data.classAssigned,
        subjectname: data.course,
        dueDate: data.dueDate,
        createdAt: new Date().toISOString(),
      };
      setAssignments([newAssignment, ...assignments]);
      toastMessage("Assignment created successfully!", "success");
      reset();
      router.push("/dashboard/teacher/assignment");
    } catch (error) {
      toastMessage("Failed to create assignment", "error");
    }
  };

  //

  const uniqueClass = [
    ...new Set(subjectClass?.map((course) => course.classname)),
  ];

  const uniqueCourses = [
    ...new Set(findTeacherCourse?.map((course) => course.subjectname)),
  ];
  const classOptions = uniqueClass?.map((clsName) => ({
    label: clsName,
    value: clsName,
  }));

  //
  const courseOptions = uniqueCourses?.map((subject) => ({
    label: subject,
    value: subject,
  }));

  return (
    <Container maxWidth="false" className="mt-8 px-4 pb-12">
      <Paper elevation={3} className="p-6 rounded-2xl">
        <Box className="mb-6 border-b border-gray-200 pb-4">
          <Typography variant="h5" className="font-bold text-gray-800">
            Create New Assignment
          </Typography>
        </Box>

        <form
          onSubmit={handleSubmit(handleAssign)}
          className="flex flex-col gap-5"
        >
          <FormSelect
            name="course"
            control={control}
            label="Select Subject"
            options={
              courseOptions.length > 0
                ? courseOptions
                : [{ label: "No courses assigned", value: "" }]
            }
          />

          <FormSelect
            name="classAssigned"
            control={control}
            label="Assigned Class"
            options={
              classOptions.length > 0
                ? classOptions
                : [{ label: "No Class assigned", value: "" }]
            }
          />
          <FormField
            name="title"
            label="Assignment Name"
            type="text"
            control={control}
            placeholder="e.g.,Chapter 4 Math Exercises"
            fullWidth
          />
          <FormField
            name="description"
            label="Instructions"
            type="text"
            control={control}
            multiline
            placeholder="Assignment  instructions"
            fullWidth
            rows={4}
          />
          <Box className="w-full ">
            <Typography variant="overline" className="justify-start">
              Due Date
            </Typography>
            <FormField name="dueDate" type="date" control={control} fullWidth />
          </Box>

          <Box className="flex gap-4 ">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              Assignment
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              onClick={() => reset()}
            >
              Clear
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
