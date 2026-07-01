"use client";

import FormSelect from "@/components/reusable/ResuableSelect";
import FormField from "@/components/reusable/reusableForm";
import FormRadio from "@/components/reusable/ReusableRadio";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  Container,
  Box,  
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
} from "@mui/material";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

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
    .oneOf(["Student", "Teacher", "Admin", "Parents"])
    .required("Role is required"),
  parentId: Yup.string().nullable().optional(),
  feeType: Yup.string().when("role", {
    is: (role) => role?.toUpperCase() === "STUDENT",
    then: () => Yup.string().required("Fee Type is required"),
    otherwise: () => Yup.string().nullable().optional(),
  }),
});

export default function AddUser() {
  const { data: session } = useSession();
  const router = useRouter();

  const [userData, setUserData] = useLocalStorage("userData", []);
  const [parentChildData, setParentChildData] = useLocalStorage(
    "parentChildData",
    [],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const { control, handleSubmit, reset, watch, setValue } = useForm({
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
      parentId: "",
      feeType: "",
    },
  });

  const selectedRole = watch("role");
  const parents = userData.filter(
    (user) => String(user.role).toUpperCase() === "PARENTS",
  );

  // add user on submit
  const addUser = async (data) => {
    try {
      if (session?.user?.role?.toUpperCase() !== "ADMIN") {
        return toastMessage("Unauthorized! Try Again", "error");
      }

      data.name = data.name?.trim();
      data.email = data.email?.trim()?.toLowerCase();
      const findUser = userData.find((user) => user.email === data.email);
      if (findUser) {
        return toastMessage("A user with this email already exists", "error");
      }
      if (data.role?.toUpperCase() !== "STUDENT") {
        data.parentId = null;
        data.parentName = null;
      }

      const { confirmpassword, ...safeData } = data;

      const newUserId = Date.now();
      const isStudent = safeData.role?.toUpperCase() === "STUDENT";

      const newUser = {
        id: newUserId,
        ...safeData,
        password: data.password,
        confirmpassword: data.confirmpassword,
        ...(isStudent
          ? {
              feeType: safeData.feeType,
              feeStatus: "Pending",
            }
          : {
              feeType: null,
              feeStatus: null,
            }),
      };

      let updatedUserData = [newUser, ...userData];
      let updatedParentChildData = [...parentChildData];

      if (newUser.role?.toUpperCase() === "STUDENT" && newUser.parentId) {
        const parentIndex = updatedUserData.findIndex(
          (user) => String(user.id) === String(newUser.parentId),
        );

        if (
          parentIndex === -1 ||
          updatedUserData[parentIndex].role?.toUpperCase() !== "PARENTS"
        ) {
          return toastMessage("Invalid parent selected", "error");
        }

        const parentDetails = updatedUserData[parentIndex];
        newUser.parentName = parentDetails.name;

        updatedParentChildData.unshift({
          id: Date.now() + 1,
          parentId: parentDetails.id,
          parentName: parentDetails.name,
          parentEmail: parentDetails.email,
          studentId: newUserId,
          studentName: newUser.name,
          studentEmail: newUser.email,
          classname: newUser.classname || "N/A",
        });

        const updatedIds = [
          ...new Set([...(parentDetails.studentIds || []), newUserId]),
        ];
        const updatedNames = [
          ...new Set([...(parentDetails.studentNames || []), newUser.name]),
        ];

        updatedUserData[parentIndex] = {
          ...parentDetails,
          studentIds: updatedIds,
          studentNames: updatedNames,
          children: updatedIds.length,
        };
      }

      updatedUserData = updatedUserData.map((user) => {
        if (user.role?.toUpperCase() === "PARENTS") {
          const uniqueIds = [...new Set(user.studentIds || [])];

          const validStudents = uniqueIds
            .map((studentId) =>
              updatedUserData.find((u) => String(u.id) === String(studentId)),
            )
            .filter(Boolean);

          return {
            ...user,
            studentIds: validStudents.map((s) => s.id),
            studentNames: validStudents.map((s) => s.name),
            children: validStudents.length,
          };
        }
        return user;
      });

      setUserData(updatedUserData);
      setParentChildData(updatedParentChildData);
      toastMessage("User added successfully!", "success");
      setTimeout(() => {
        reset();
        router.replace("/dashboard/admin");
      }, 500);
    } catch (error) {
      console.error(error);
      toastMessage("Failed to add user", "error");
    }
  };

  useEffect(() => {
    if (selectedRole?.toUpperCase() !== "STUDENT") {
      setValue("parentId", "");
      setValue("feeType", "");
    }
  }, [selectedRole, setValue]);

  return (
    <Container
      maxWidth="lg"
      className=" justify-center items-start p-6 w-full h-full"
    >
      <Box className="text-center   gap-3 mb-2 justify-center items-center">
        <Typography variant="h5" className="font-bold text-gray-800">
          Create New User
        </Typography>
      </Box>
      <form
        onSubmit={handleSubmit(addUser)}
        className="flex flex-col gap-4 w-full"
      >
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </Box>

        {/* Passwords */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormField
            name="confirmpassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            control={control}
            placeholder="Confirm password"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormRadio
            name="gender"
            label="Gender"
            control={control}
            row
            options={[
              {
                label: "Male",
                value: "Male",
              },
              {
                label: "Female",
                value: "Female",
              },
              {
                label: "Other",
                value: "Other",
              },
            ]}
          />

          <FormSelect
            name="role"
            control={control}
            label="Select Role"
            options={[
              { value: "Student", label: "Student" },
              { value: "Teacher", label: "Teacher" },
              { value: "Admin", label: "Admin" },
              { value: "Parents", label: "Parents" },
            ]}
          />
        </Box>
        {selectedRole?.toUpperCase() === "STUDENT" ? (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormSelect
              name="parentId"
              control={control}
              label="Select Parent (Optional)"
              options={parents.map((parentData) => ({
                value: String(parentData.id),
                label: `${parentData.name} (${parentData.email})`,
              }))}
            />

            <FormSelect
              name="feeType"
              label="Select Fee Type"
              control={control}
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "Half-Yearly", value: "Half-Yearly" },
                { label: "Annual", value: "Annual" },
              ]}
            />
          </Box>
        ) : null}
        {/* Address */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </Box>
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </Box>

        <Button variant="contained" color="primary" type="submit" size="large">
          Add User Account
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
    </Container>
  );
}
