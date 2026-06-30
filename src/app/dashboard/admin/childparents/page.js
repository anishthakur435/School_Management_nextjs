"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box, Button, MenuItem, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";

const schema = Yup.object().shape({
  parentId: Yup.string().required("Parent is required"),
  studentId: Yup.string().required("Student is required"),
});

const generateId = () => Date.now();

export default function AssignParentsStudent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [parentChildData, setParentChildData] = useLocalStorage(
    "parentChildData",
    [],
  );

  const parents = userData.filter(
    (user) => String(user.role).toUpperCase() === "PARENTS",
  );
  const students = userData.filter(
    (user) => String(user.role).toUpperCase() === "STUDENT",
  );

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { parentId: "", studentId: "" },
  });

  const onSubmit = (formData) => {
    // console.log("formData", formData);
    try {
      const existingStudent = parentChildData.find(
        (record) => String(record.studentId) === String(formData.studentId),
      );

      // If already assigned
      if (existingStudent) {
        return toastMessage(
          "Student is already assigned to a Parent.",
          "error",
        );
      }
      const parentDetails = userData.find(
        (user) => String(user.id) === String(formData.parentId),
      );
      const studentDetails = userData.find(
        (user) => String(user.id) === String(formData.studentId),
      );
      if (!parentDetails || !studentDetails) {
        return toastMessage("Cannot find user records.", "error");
      }

      const newAssignment = {
        id: generateId(),
        parentId: formData.parentId,
        parentName: parentDetails.name,
        parentEmail: parentDetails.email,
        studentId: formData.studentId,
        studentName: studentDetails.name,
        studentEmail: studentDetails.email,
        classname: studentDetails.classname || "N/A",
      };

      const updatedUserData = userData.map((user) => {
        if (String(user.id) === String(formData.parentId)) {
          const currentStudentIds = user.studentIds || [];
          const currentStudentNames = user.studentNames || [];

          const updatedIds = currentStudentIds.includes(studentDetails.id)
            ? currentStudentIds
            : [formData.studentId, ...currentStudentIds];

          const updatedNames = currentStudentNames.includes(studentDetails.name)
            ? currentStudentNames
            : [studentDetails.name, ...currentStudentNames];

          return {
            ...user,
            studentIds: updatedIds,
            studentNames: updatedNames,
            children: updatedIds.length,
          };
        }

        if (String(user.id) === String(formData.studentId)) {
          return {
            parentId: formData.parentId,
            parentName: parentDetails.name,
            ...user,
          };
        }
        return user;
      });

      // console.log("updatedUserData", updatedUserData);
      // console.log("newAssignment", newAssignment);

      setParentChildData([...parentChildData, newAssignment]);
      setUserData(updatedUserData);

      toastMessage("Student added to Parent profile successfully!", "success");
      reset();
      router.push("/dashboard/admin");
    } catch (error) {
      console.error(error);
      toastMessage("Something went wrong.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 space-y-8 pb-12">
      <div>
        <Typography variant="h5" className="font-bold">
          Assign Parent to Student
        </Typography>
      </div>

      <Paper elevation={2} className="p-6 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="flex flex-col gap-4 p-4">
            <FormField
              name="parentId"
              label="Select Parent"
              select
              control={control}
            >
              {parents.map((parentData) => (
                <MenuItem key={parentData.id} value={String(parentData.id)}>
                  {parentData.name} ({parentData.email})
                </MenuItem>
              ))}
            </FormField>

            <FormField
              name="studentId"
              label="Select Student"
              select
              control={control}
            >
              {students.map((studentData) => (
                <MenuItem key={studentData.id} value={String(studentData.id)}>
                  {studentData.name} (
                  {studentData.classname || studentData.email})
                </MenuItem>
              ))}
            </FormField>

            <Box className="flex justify-start mt-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Assign Parent
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </div>
  );
}
