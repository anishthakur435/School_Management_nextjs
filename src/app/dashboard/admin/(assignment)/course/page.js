"use client";
import FormSelect from "@/components/reusable/ResuableSelect";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, MenuItem, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

const schema = Yup.object().shape({
  classname: Yup.string().required("Class selection is required"),
  subjectname: Yup.string().required("Subject selection is required"),
  teacher: Yup.string().required("Teacher selection is required"),
});

const generateId = () => Date.now();

export default function AssignCourse() {
  const router = useRouter();
  const [userData] = useLocalStorage("userData", []);
  const [subject] = useLocalStorage("subjects", []);
  const [createdClass] = useLocalStorage("createdClass", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      classname: "",
      subjectname: "",
      teacher: "",
    },
  });

  const teachers = userData.filter(
    (user) => user.role.toUpperCase() === "TEACHER",
  );

  const onSubmit = (data) => {
    try {
      const courseExists = assignedCourses.find(
        (course) =>
          course.classname === data.classname &&
          course.subjectname === data.subjectname,
      );

      const findSubject = subject.find(
        (course) => course.subjectname === data.subjectname,
      );

      if (courseExists) {
        toastMessage(
          `${data.subjectname} is already assigned to ${data.classname}`,
          "error",
        );
        return;
      }

      const findTeacher = teachers.find(
        (teacher) => teacher.name === data.teacher,
      );

      if (!findTeacher) {
        toastMessage("Cannot find the selected teacher.", "error");
        return;
      }

      const newAssignment = {
        id: generateId(),
        ...data,
        subjectcode: findSubject.subjectcode,
        assignedAt: new Date().toISOString(),
      };

      setAssignedCourses([newAssignment, ...assignedCourses]);
      toastMessage("Course assigned successfully!", "success");
      reset();
      router.push("/dashboard/admin");
    } catch (error) {
      toastMessage("Failed to Assign Course", "error");
    }
  };

  return (
    <Box className="flex items-center justify-center h-full bg-gray-50 px-4 py-10">
      <Paper
        elevation={4}
        className="w-full max-w-md rounded-3xl p-8 shadow-xl"
      >
        <Box className="text-center mb-6">
          <Typography
            variant="h4"
            className="font-bold tracking-wide text-gray-800"
          >
            Allocate Course
          </Typography>

          <Typography variant="body2" className="text-gray-500 mt-2">
            Assign subjects and teachers to classes
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormSelect
            name="classname"
            control={control}
            label="Select Class"
            options={createdClass.map((existingClass) => ({
              value: existingClass.classname,
              label: existingClass.classname,
            }))}
          />

          <FormSelect
            name="subjectname"
            control={control}
            label="Select Subject"
            options={subject.map((course) => ({
              value: course.subjectname,
              label: course.subjectname,
            }))}
          />
          <FormSelect
            name="teacher"
            control={control}
            label="Select Teacher"
            options={teachers.map((teacher) => ({
              value: teacher.name,
              label: teacher.name,
            }))}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Assign Course
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
