"use client";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import EditIcon from "@mui/icons-material/Edit";
import * as Yup from "yup";
import ReusableModal from "../reusable/reusableModal";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required").trim(),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .trim()
    .lowercase(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  contact: Yup.string()
    .required("Contact is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .typeError("Contact must be a number"),
  role: Yup.string()
   .oneOf(["Student", "Teacher", "Admin" , "Parents" ,])
    .required("Role is required"),
});

export default function EditUserPage() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useLocalStorage("userData", []);

  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      password: "",
      role: "",
    },
  });


  // edit user details
  const editUser = (editUserData) => {
    try {
      const oldUser = userData.find((user) => user.id == id);

      if (!oldUser) {
        toastMessage("User not found.", "error");
        return;
      }

      const duplicateEmail = userData.find(
        (user) => user.id != id && user.email === editUserData.email,
      );

      if (duplicateEmail) {
        toastMessage(
          "This email is already in use by another account",
          "error",
        );
        return;
      }

      const updatedUsersList = userData.map((user) => {
        if (user.id == id) {
          return { ...user, ...editUserData };
        }
        return user;
      });

      if (oldUser.name !== editUserData.name) {
        const updatedClasses = createdClass.map((cls) => {
          if (cls.teacher === oldUser.name) {
            return { ...cls, teacher: editUserData.name };
          }
          return cls;
        });
        setCreatedClass(updatedClasses);

        const updatedCourses = assignedCourses.map((course) => {
          if (course.teacher === oldUser.name) {
            return { ...course, teacher: editUserData.name };
          }
          return course;
        });
        setAssignedCourses(updatedCourses);

        const updatedClassStudents = classStudent.map((student) => {
          if (student.student === oldUser.name) {
            return { ...student, student: editUserData.name };
          }
          return student;
        });
        setClassStudent(updatedClassStudents);
      }

      setUserData(updatedUsersList);
      toastMessage("User updated successfully!", "success");
      router.replace("/dashboard/admin");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to update user", "error");
    }
  };

  // add user details to form 
  useEffect(() => {
    if (id && userData.length > 0) {
      const findUserID = userData.find((user) => user.id == id);
      if (findUserID) {
        reset({
          name: findUserID.name,
          contact: findUserID.contact,
          email: findUserID.email,
          password: findUserID.password,
          role: findUserID.role,
        });
      }
    }
  }, [id, userData, reset]);


  if (!session) return null;

  // only admin can edit details 
  if (session?.user?.role?.toUpperCase() === "ADMIN") {
    return (
      <Box className="">
        <Tooltip title="Edit User" arrow>
          <IconButton
            color="info"
            onClick={() => setOpen(true)}
            style={{ border: "1px solid currentColor" }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <ReusableModal open={open} onClose={() => setOpen(false)}>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(editUser)}
          >
            <FormField name="name" label="Name" type="text" control={control} />

            <FormField
              name="email"
              label="Email"
              type="email"
              control={control}
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              control={control}
            />

            <FormField
              name="contact"
              label="Contact"
              type="text"
              control={control}
            />

            <FormField name="role" control={control} label="Role" select>
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="TEACHER">Teacher</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </FormField>

            <Box className="flex flex-col gap-3 mt-2">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Update User
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                size="large"
                className="rounded-xl py-3 font-semibold"
                onClick={() => {
                  setOpen(false);

                  router.back();
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </ReusableModal>
      </Box>
    );
  }

  return null;
}
