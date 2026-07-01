"use client";

import FormSelect from "@/components/reusable/ResuableSelect";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Paper, Typography, Button, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

const schema = Yup.object().shape({
  student: Yup.string().required("Student selection is required"),
  classname: Yup.string().required("Class name is required"),
  rollno: Yup.string().required("Roll number is required"),
  teacher: Yup.string().required("Teacher is required"),
});

export default function AssignClass() {
  const router = useRouter();
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [createdClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);

  const students = userData.filter(
    (user) => user.role.toUpperCase() === "STUDENT",
  );

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      student: "",
      classname: "",
      rollno: "",
      teacher: "",
    },
  });

  const selectedClassname = watch("classname");

  useEffect(() => {
    if (selectedClassname) {
      const matchedClass = createdClass.find(
        (cls) => cls.classname === selectedClassname,
      );
      if (matchedClass) {
        setValue("teacher", matchedClass.teacher, { shouldValidate: true });
      }
    }
  }, [selectedClassname, createdClass, setValue]);

  const onSubmit = (data) => {
    try {
      const existingStudent = classStudent.find(
        (record) => record.student === data.student,
      );

      if (existingStudent) {
        toastMessage(
          `Student is already assigned to ${existingStudent.classname}`,
          "error",
        );
        return;
      }

      const duplicateRollNo = classStudent.find(
        (record) =>
          record.classname === data.classname &&
          record.rollno.toLowerCase() === data.rollno.toLowerCase(),
      );

      if (duplicateRollNo) {
        toastMessage(
          "This Roll Number is already taken in this class.",
          "error",
        );
        return;
      }

      const findStudent = userData.find(
        (student) => student.name === data.student,
      );

      if (!findStudent) {
        toastMessage("Cannot find student in database.", "error");
        return;
      }

      const updatedUsersList = userData.map((user) => {
        if (user.id == findStudent.id) {
          return { ...user, classname: data.classname, rollno: data.rollno };
        }
        return user;
      });

      const newAssignment = { id: Date.now(), ...data };
      setUserData(updatedUsersList);
      setClassStudent([newAssignment, ...classStudent]);

      toastMessage("Student assigned successfully!", "success");
      reset();
      router.push("/dashboard/admin/assignclass");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to assign student to class.", "error");
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
            Enroll Students
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormSelect
            name="student"
            control={control}
            label="Select Student"
            options={students.map((student) => ({
              value: student.name,
              label: student.name,
            }))}
          />
          {/* <FormField
            name="student"
            control={control}
            label="Select Student"
            select
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.name}>
                {student.name}
              </MenuItem>
            ))}
          </FormField> */}

          <FormSelect
            name="classname"
            control={control}
            label="Select Class"
            options={createdClass.map((existingClass) => ({
              value: existingClass.classname,
              label: existingClass.classname,
            }))}
          />
          {/* <FormField
            name="classname"
            control={control}
            label="Select Class"
            select
          >
            {createdClass.map((existingClass) => (
              <MenuItem key={existingClass.id} value={existingClass.classname}>
                {existingClass.classname}
              </MenuItem>
            ))}
          </FormField> */}

          <FormField
            name="rollno"
            placeholder="e.g. ROLL-123"
            control={control}
            label="Roll No."
          />

          <FormField
            name="teacher"
            control={control}
            label="Assigned Teacher"
            placeholder="Auto-fills based on class"
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg"
          >
            Assign
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
