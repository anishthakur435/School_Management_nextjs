"use client";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { signIn, useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .trim()
    .lowercase(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignInPage() {
  const [userData, setUserData] = useLocalStorage("userData", []);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
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
          firstname: "Student",
          lastname: " User",
          name: "Student User",
          email: "student@test.com",
          password: "student123",
          contact: "9867675678",
          role: "Student",
        },
        {
          id: 3,
          firstname: "Teacher",
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
        {
          id: 5,
          firstname: "Librarian",
          lastname: " User",
          name: "Librarian User",
          email: "librarian@test.com",
          password: "librarian123",
          contact: "8746345613",
          role: "Librarian",
        },
      ];
      setUserData(defaultUsers);
    } else {
      const hasLibrarian = userData.some((user) => user.role === "Librarian");
      if (!hasLibrarian) {
        setUserData([
          ...userData,
          {
            id: 5,
            firstname: "Librarian",
            lastname: " User",
            name: "Librarian User",
            email: "librarian@test.com",
            password: "librarian123",
            contact: "8746345613",
            role: "Librarian",
          },
        ]);
      }
    }
  }, [userData, setUserData]);

  const onSubmit = async (userCredentials) => {
    const normalizedEmail = userCredentials.email.trim().toLowerCase();

    const filteredUser = userData.find(
      (user) =>
        user.email.trim().toLowerCase() === normalizedEmail &&
        user.password === userCredentials.password,
    );

    if (filteredUser) {
      const response = await signIn("credentials", {
        id: filteredUser.id,
        name: filteredUser.name,
        email: filteredUser.email,
        role: filteredUser.role,
        contact: filteredUser.contact,
        password: filteredUser.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (response?.ok) {
        toastMessage("Sign in successful!", "success");
        reset();
        router.replace("/dashboard");
      } else {
        toastMessage("Sign in failed. Please try again.", "error");
      }
    } else {
      toastMessage("Invalid email or password", "error");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return null;
  }

  return (
    
    <Box
      className="min-h-screen flex 
      bg-gradient-to-l from-violet-100
    "
    >
      <Box
        className="hidden lg:flex flex-col justify-center items-center w-5/6  p-12  opacity-70   bg-[url('https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D')] bg-cover bg-center
"
      ></Box>

      <Box className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 ">
        <Box className="w-full max-w-md">
          <Box className="text-center mb-8">
            <Typography
              variant="h4"
              className="font-bold tracking-wide text-gray-800"
            >
              Sign In
            </Typography>

            <Box
              component={Container}
              className="mt-6 p-4  rounded-lg text-sm text-left scroll-auto h-24 overflow-auto"
            >
              <Typography
                variant="subtitle2"
                className="font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1"
              >
                Demo Credentials
              </Typography>
              <div className="flex flex-col gap-1 text-gray-600">
                <span>
                  <strong className="text-gray-800">Admin:</strong>
                  admin@test.com / admin123
                </span>
                <span>
                  <strong className="text-gray-800">Student:</strong>
                  student@test.com / student123
                </span>
                <span>
                  <strong className="text-gray-800">Teacher:</strong>
                  teacher@test.com / teacher123
                </span>
                <span>
                  <strong className="text-gray-800">Parents:</strong>
                  <p>parents@test.com / parents123</p>
                </span>
                <span>
                  <strong className="text-gray-800">Librarian:</strong>
                  <p>librarian@test.com / librarian123</p>
                </span>
              </div>
            </Box>
          </Box>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              name="email"
              label="Email Address"
              type="email"
              control={control}
              placeholder="Enter your email"
            />

            <FormField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              control={control}
              placeholder="Enter your password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              disableElevation
              className="w-full rounded-lg py-3.5 font-semibold shadow-md hover:shadow-lg transition-all duration-300 mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
