"use client";
import FormField from "@/components/reusable/reusableForm";
import ReusableModal from "@/components/reusable/reusableModal";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

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
    .oneOf(["Student", "Teacher", "Admin", "Parents"])
    .required("Role is required"),
});
export default function AddUserPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const [userData, setUserData] = useLocalStorage("userData", []);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
      role: "",
    },
  });

  const addUser = async (data) => {
    if (session?.user?.role?.toUpperCase() === "ADMIN") {
      const findUser = userData.find((user) => user.email === data.email);

      if (!findUser) {
        const generateId = () => Date.now();
        const newUser = { id: generateId(), ...data };
        setUserData([newUser, ...userData]);

        toastMessage("User added successfully!", "success");
        setOpen(false);
        reset();
        router.replace("/dashboard/admin");
      } else {
        toastMessage("A user with this email already exists", "error");
      }
    } else {
      toastMessage("Unauthorized! Try Again", "error");
    }
  };
  return (
    <>
      <Box>
        <Tooltip title="Add User" arrow>
          <IconButton
            onClick={() => setOpen(true)}
            color="info"
            className="border border-blue-200 bg-blue-50 hover:bg-blue-100"
            sx={{ p: 1.5 }}
          >
            <AddIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>

        <ReusableModal open={open} onClose={handleClose}>
          <Box className="max-w-lg mx-auto">
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-gray-800 mb-6 text-center"
            >
              Create New User Account
            </Typography>

            <form
              onSubmit={handleSubmit(addUser)}
              className="flex flex-col gap-5"
            >
              <FormField
                name="name"
                label="Full Name"
                type="text"
                control={control}
                placeholder="Enter full name"
                fullWidth
              />

              <FormField
                name="email"
                label="Email Address"
                type="email"
                control={control}
                placeholder="Enter email address"
                fullWidth
              />

              <FormField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                control={control}
                placeholder="Enter password"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormField
                name="contact"
                label="Contact Number"
                type="text"
                control={control}
                placeholder="Enter contact number"
                fullWidth
              />

              <FormField
                name="role"
                control={control}
                label="Select Role"
                select
                fullWidth
              >
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="TEACHER">Teacher</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </FormField>

              <Box className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  className="flex-1 rounded-xl py-3 font-semibold text-gray-600 border-gray-300 order-2 sm:order-1 normal-case"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  className="flex-1 rounded-xl py-3 font-semibold text-white"
                >
                  Add User
                </Button>
              </Box>
            </form>
          </Box>
        </ReusableModal>
      </Box>
    </>
  );
}
