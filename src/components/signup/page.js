"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormField from "@/components/reusable/reusableForm";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toastMessage } from "@/components/reusable/reusableToast";
import useLocalStorage from "use-local-storage";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = Yup.object().shape({
  name: Yup.string().required("First name is required").trim(),
  firstname: Yup.string().required("First name is required").trim(),
  lastname: Yup.string().required("Last name is required").trim(),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .trim()
    .lowercase(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  contact: Yup.string()
    .required("Contact is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  age: Yup.number()
    .positive()
    .integer()
    .required("Age is required")
    .min(18, "Atleast 18 years old")
    .max(80, "Not more than 80years")
    .typeError("Age must be a number"),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string()
    .required("Postal code is required")
    .matches(/^\d{6}$/, "Postal code must be 6 digits")
    .typeError("must be a number"),

  role: Yup.string()
    .oneOf(["Student", "Teacher", "Parents"])
    .required("Role is required"),
});

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      contact: "",
      age: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      role: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (!userData || userData.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          firstname: "Admin ",
          lastname: " User",
          name: "Admin User",
          email: "admin@test.com",
          password: "admin123",
          contact: "8799879090",
          role: "Admin",
        },
        {
          id: 2,
          firstname: "Student ",
          lastname: " User",
          name: "Student User",
          email: "student@test.com",
          password: "student123",
          contact: "9867675678",
          role: "Student",
        },
        {
          id: 3,
          firstname: "Teacher ",
          lastname: " User",
          name: "Teacher User",
          email: "teacher@test.com",
          password: "teacher123",
          contact: "8765867890",
          role: "Teacher",
        },
        {
          id: 4,
          firstname: "Parents",
          lastname: " User",
          name: "Parents User",
          email: "parents@test.com",
          password: "parents123",
          contact: "8746345612",
          role: "Parents",
        },
      ];
      setUserData(defaultUsers);
    }
  }, [userData, setUserData]);

  const registerUser = async (registerCredentials) => {
    try {
      const normalizedEmail = registerCredentials.email.trim().toLowerCase();

      const emailExists = userData.find(
        (user) => user.email.trim().toLowerCase() === normalizedEmail,
      );

      if (emailExists) {
        toastMessage("An account with this email already exists", "error");
        return;
      }

      const generateId = () => Date.now();
      const userId = generateId();
      const userDataWithId = {
        id: userId,
        ...registerCredentials,
        name: registerCredentials.name.trim(),
        email: normalizedEmail,
      };

      setUserData([userDataWithId, ...userData]);
      toastMessage("User registered successfully!", "success");

      const response = await signIn("credentials", {
        id: userDataWithId.id,
        name: userDataWithId.name,
        email: userDataWithId.email,
        role: userDataWithId.role,
        contact: userDataWithId.contact,
        password: userDataWithId.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (response?.ok) {
        reset();
        router.replace("/dashboard");
      } else {
        toastMessage(
          "Account created, but sign-in failed. Please login manually.",
          "amber",
        );
        router.replace("/signin");
      }
    } catch (error) {
      console.error(error);
      toastMessage("Registration failed. Please try again.", "error");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    <>
      <Box className="min-h-screen flex items-center justify-center bg-[#dcdde1]">
        <Box className="  p-8 bg-[#f5f6fa]  rounded-xl shadow-lg" elevation={5}>
          <Box className="text-center mb-6">
            <Typography
              variant="h4"
              className="font-bold tracking-wide text-gray-800 "
            >
              Sign Up
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-2">
              Create your member account
            </Typography>
          </Box>

          <form
            onSubmit={handleSubmit(registerUser)}
            className="flex flex-col gap-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="name"
                label=" User Name"
                type="text"
                control={control}
                placeholder="Enter User name"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="firstname"
                label="First Name"
                type="text"
                control={control}
                placeholder="Enter first name"
                fullWidth
              />

              <FormField
                name="lastname"
                label="Last Name"
                type="text"
                control={control}
                placeholder="Enter last name"
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                control={control}
                placeholder="Enter password"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormField
                name="confirmpassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                control={control}
                placeholder="Confirm password"
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleConfirmPasswordVisibility}>
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="contact"
                label="Contact Number"
                type="text"
                control={control}
                placeholder="Enter contact number"
                fullWidth
              />

              <FormField
                name="age"
                label="Age"
                type="number"
                control={control}
                placeholder="Enter age"
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="gender"
                label="Gender"
                select
                control={control}
                fullWidth
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </FormField>

              <FormField
                name="role"
                control={control}
                label="Select Role"
                select
                fullWidth
              >
                <MenuItem value="Student">Student</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Parents">Parents</MenuItem>
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                name="address"
                label="Address"
                type="text"
                control={control}
                placeholder="Enter address"
                fullWidth
              />
              <FormField
                name="city"
                label="City"
                type="text"
                control={control}
                placeholder="Enter city"
                fullWidth
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <FormField
                name="state"
                label="State"
                type="text"
                control={control}
                placeholder="Enter state"
                fullWidth
              />
              <FormField
                name="postalCode"
                label="Postal Code"
                type="text"
                control={control}
                placeholder="Enter postal code"
                fullWidth
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              className="mt-4 rounded-xl py-3.5 font-bold text-base bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-xl transition-all duration-300 normal-case"
            >
              Add User Account
            </Button>
            <Box className="text-sm text-center mt-2 text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign In
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
