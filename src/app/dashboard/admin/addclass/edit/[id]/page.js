"use client";
import FormField from "@/components/reusable/reusableForm";
import { Box, Button, MenuItem, Paper, Typography } from "@mui/material";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useParams, useRouter } from "next/navigation";

const schema = Yup.object().shape({
  classname: Yup.string().required("Class name is required"),
  teacher: Yup.string().required("Teacher is required"),
});

export default function EditClass() {
  const router = useRouter();
  const { id } = useParams();

  const [userData, setUserData] = useLocalStorage("userData", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);

  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );

  const teachers = userData.filter((user) => user.role.toUpperCase() === "TEACHER");

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      classname: "",
      teacher: "",
    },
  });

  const EditClassData = (editClassData) => {
    const oldClass = createdClass.find((cls) => cls.id == id);
    const findTeacher = teachers.find(
      (teacher) => teacher.name === editClassData.teacher,
    );

    if (!oldClass || !findTeacher) {
      toastMessage("Could not find class or teacher details.", "error");
      return;
    }

    const duplicateClass = createdClass.find(
      (cls) =>
        cls.id != id &&
        cls.classname.toLowerCase() === editClassData.classname.toLowerCase(),
    );

    if (duplicateClass) {
      toastMessage("This class name already exists.", "error");
      return;
    }

    const updatedClassList = createdClass.map((cls) => {
      if (cls.id == id) {
        return { ...cls, ...editClassData };
      }
      return cls;
    });

    const updatedUsersList = userData.map((user) => {
      if (user.id == findTeacher.id) {
        return { ...user, classname: editClassData.classname };
      }
      return user;
    });

    if (oldClass.classname !== editClassData.classname) {
      const updatedStudents = classStudent.map((student) => {
        if (student.classname === oldClass.classname) {
          return { ...student, classname: editClassData.classname };
        }
        return student;
      });
      setClassStudent(updatedStudents);

      const updatedCourses = assignedCourses.map((course) => {
        if (course.classname === oldClass.classname) {
          return { ...course, classname: editClassData.classname };
        }
        return course;
      });
      setAssignedCourses(updatedCourses);
    }

    setUserData(updatedUsersList);
    setCreatedClass(updatedClassList);

    toastMessage("Class updated successfully", "success");
    reset();
    router.push("/dashboard/admin");
  };

  useEffect(() => {
    if (id) {
      const findClassId = createdClass.find((cls) => cls.id == id);
      if (findClassId) {
        reset(findClassId);
      }
    }
  }, [id, createdClass, reset]);

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
            Edit Class
          </Typography>
        </Box>

        <form
          onSubmit={handleSubmit(EditClassData)}
          className="flex flex-col gap-5"
        >
          <FormField
            name="classname"
            placeholder="e.g., Class-10A"
            label="Class Name"
            type="text"
            control={control}
          />

          <FormField
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
          </FormField>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Update Class
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
