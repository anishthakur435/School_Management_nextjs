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
  classname: Yup.string().required("Class name is required").trim(),
  teacher: Yup.string().required("Teacher is required"),
});

const generateId = () => Date.now();

export default function AddClass() {
  const router = useRouter();
  const [userData] = useLocalStorage("userData", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const teachers = userData.filter(
    (user) => user.role.toUpperCase() === "TEACHER",
  );

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      classname: "",
      teacher: "",
    },
  });

  const onSubmit = (data) => {
    try {
      const normalizedClassName = data.classname.trim().toLowerCase();
      const classExists = createdClass.find(
        (existingClass) =>
          existingClass.classname.trim().toLowerCase() === normalizedClassName,
      );

      if (classExists) {
        toastMessage("This class name already exists.", "error");
        return;
      }
      const findTeacher = teachers.find(
        (teacher) => teacher.name === data.teacher,
      );

      if (!findTeacher) {
        toastMessage("Cannot find the selected teacher.", "error");
        return;
      }
      const newClass = {
        id: generateId(),
        classname: data.classname.trim(),
        teacher: data.teacher,
      };
      setCreatedClass([newClass, ...createdClass]);

      toastMessage("Class created successfully!", "success");
      reset();
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      toastMessage("Error creating class.", "error");
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
            className="font-bold text-gray-800 tracking-wide"
          >
            Add Class
          </Typography>

          <Typography variant="body2" className="text-gray-500 mt-2">
            Create and assign a class teacher
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            name="classname"
            placeholder="e.g., CLASS-10A"
            label="Class Name"
            type="text"
            control={control}
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
          {/* <FormField
            name="teacher"
            control={control}
            label="Select Teacher"
            select
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.name}>
                {teacher.name}
              </MenuItem>
            ))}
          </FormField> */}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Create Class
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
