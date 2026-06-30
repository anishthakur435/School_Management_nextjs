"use client";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";
import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import FormSelect from "@/components/reusable/ResuableSelect";
import FormRadio from "@/components/reusable/ReusableRadio";

// schema

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

export default function EditUser() {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();

  //
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const [grades, setGrades] = useLocalStorage("grades", []);

  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [parentChildData, setParentChildData] = useLocalStorage(
    "parentChildData",
    [],
  );

  //
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  //
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

  //
  const selectedRole = watch("role");
  const allParents = userData.filter(
    (user) => String(user.role).toUpperCase() === "PARENTS",
  );

  //
  useEffect(() => {
    if (selectedRole?.toUpperCase() !== "STUDENT") {
      setValue("parentId", "");
      setValue("feeType", "");
    }
  }, [selectedRole, setValue]);

  //

  const editUser = (editUserData) => {
    try {
      //
      const oldUser = userData.find((user) => String(user.id) === String(id));
      if (!oldUser) {
        return toastMessage("User not found", "error");
      }

      //
      const duplicateEmail = userData.find(
        (user) =>
          String(user.id) !== String(id) &&
          user.email?.toLowerCase() === editUserData.email?.toLowerCase(),
      );
      if (duplicateEmail) {
        return toastMessage("Email already exists", "error");
      }
      if (
        editUserData.parentId &&
        String(editUserData.parentId) === String(id)
      ) {
        return toastMessage("User cannot be own parent", "error");
      }

      editUserData.name = editUserData.name?.trim();
      editUserData.email = editUserData.email?.trim()?.toLowerCase();

      //
      if (editUserData.role?.toUpperCase() !== "STUDENT") {
        delete editUserData.feeStatus;
        delete editUserData.parentId;
        delete editUserData.feeStatus;
      }

      //
      let updatedUsers = [...userData];
      let updatedParentChild = [...parentChildData];
      let updatedClasses = [...createdClass];
      let updatedGrades = [...grades];
      let updatedCourses = [...assignedCourses];
      let updatedClassStudents = [...classStudent];

      if (
        oldUser.role?.toUpperCase() === "STUDENT" &&
        editUserData.role?.toUpperCase() !== "STUDENT"
      ) {
        updatedUsers = updatedUsers.map((user) => {
          if (String(user.id) === String(oldUser.parentId)) {
            const updatedIds = (user.studentIds || []).filter(
              (studentId) => String(studentId) !== String(id),
            );

            const updatedNames = (user.studentNames || []).filter(
              (name) => name !== oldUser.name,
            );
            return {
              ...user,
              studentIds: updatedIds,
              studentNames: updatedNames,
              children: updatedIds.length,
            };
          }
          return user;
        });

        updatedParentChild = updatedParentChild.filter(
          (record) => String(record.studentId) !== String(id),
        );
      }

      if (editUserData.role?.toUpperCase() === "STUDENT") {
        const oldParentId = oldUser.parentId || null;
        const newParentId = editUserData.parentId || null;
        if (oldParentId !== newParentId) {
          updatedUsers = updatedUsers.map((user) => {
            if (String(user.id) === String(oldParentId)) {
              const updatedIds = (user.studentIds || []).filter(
                (studentId) => String(studentId) !== String(id),
              );
              const updatedNames = (user.studentNames || []).filter(
                (name) => name !== oldUser.name,
              );

              return {
                ...user,
                studentIds: updatedIds,
                studentNames: updatedNames,
                children: updatedIds.length,
              };
            }
            if (String(user.id) === String(newParentId)) {
              const updatedIds = [...new Set([...(user.studentIds || []), id])];
              const updatedNames = [
                ...new Set([...(user.studentNames || []), editUserData.name]),
              ];
              return {
                ...user,
                studentIds: updatedIds,
                studentNames: updatedNames,
                children: updatedIds.length,
              };
            }

            return user;
          });

          // update parent child data
          updatedParentChild = updatedParentChild.filter(
            (record) => String(record.studentId) !== String(id),
          );
          const newParent = updatedUsers.find(
            (user) => String(user.id) === String(newParentId),
          );
          if (newParent) {
            updatedParentChild.push({
              id: Date.now(),
              parentId: newParent.id,
              parentName: newParent.name,
              parentEmail: newParent.email,
              studentId: oldUser.id,
              studentName: editUserData.name,
              studentEmail: editUserData.email,
              classname: editUserData.classname || "N/A",
            });
          }
        }
      }

      //
      if (oldUser.name !== editUserData.name) {
        // update parent names
        updatedUsers = updatedUsers.map((user) => {
          if (String(user.parentId) === String(id)) {
            return {
              ...user,
              parentName: editUserData.name,
            };
          }
          return user;
        });

        // update parentChildData
        updatedParentChild = updatedParentChild.map((record) => {
          if (String(record.parentId) === String(id)) {
            return {
              ...record,
              parentName: editUserData.name,
            };
          }
          if (String(record.studentId) === String(id)) {
            return {
              ...record,
              studentName: editUserData.name,
            };
          }
          return record;
        });

        // update classes
        updatedClasses = updatedClasses.map((cls) => {
          if (cls.teacher === oldUser.name) {
            return {
              ...cls,
              teacher: editUserData.name,
            };
          }
          return cls;
        });

        // update grades

        updatedGrades = updatedGrades.map((grade) => {
          let updatedGrade = {
            ...grade,
          };

          if (grade.teacherName === oldUser.name) {
            updatedGrade.teacherName = editUserData.name;
          }

          if (grade.student === oldUser.name) {
            updatedGrade.student = editUserData.name;
          }

          return updatedGrade;
        });

        // update courses

        updatedCourses = updatedCourses.map((course) => {
          if (course.teacher === oldUser.name) {
            return {
              ...course,
              teacher: editUserData.name,
            };
          }

          return course;
        });

        // update class students

        updatedClassStudents = updatedClassStudents.map((student) => {
          if (student.student === oldUser.name) {
            return {
              ...student,
              student: editUserData.name,
            };
          }

          return student;
        });
      }

      // email
      updatedParentChild = updatedParentChild.map((record) => {
        if (String(record.studentId) === String(id)) {
          return {
            ...record,
            studentEmail: editUserData.email,
          };
        }

        if (String(record.parentId) === String(id)) {
          return {
            ...record,
            parentEmail: editUserData.email,
          };
        }

        return record;
      });

      // user details

      updatedUsers = updatedUsers.map((user) => {
        if (String(user.id) === String(id)) {
          const isStudent = editUserData.role?.toUpperCase() === "STUDENT";
          return {
            ...user,
            ...editUserData,
            feeType: isStudent ? editUserData.feeType : null,
            feeStatus: isStudent ? user.feeStatus || "Pending" : null,
          };
        }
        return user;
      });

      updatedUsers = updatedUsers.map((user) => {
        if (user.role?.toUpperCase() === "PARENTS") {
          const uniqueIds = [...new Set(user.studentIds || [])];

          const validStudents = uniqueIds
            .map((studentId) =>
              updatedUsers.find((u) => String(u.id) === String(studentId)),
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
      setUserData(updatedUsers);
      setParentChildData(updatedParentChild);
      setCreatedClass(updatedClasses);
      setGrades(updatedGrades);
      setAssignedCourses(updatedCourses);
      setClassStudent(updatedClassStudents);
      toastMessage("User updated successfully!", "success");
      reset();
      router.replace("/dashboard/admin");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to update user", "error");
    }
  };

  // resert user in form
  useEffect(() => {
    if (id && userData.length > 0) {
      const findUserID = userData.find((user) => user.id == id);
      if (findUserID) {
        reset(findUserID);
      }
    }
  }, [id, userData, reset]);

  // if no session return null
  // if (!session) return null;

  // edit only if used is admin
  if (session?.user?.role?.toUpperCase() === "ADMIN") {
    return (
      <div className=" justify-center items-start p-6 w-full">
        <div className="text-center mb-2">
          <Typography variant="h5" className="font-bold text-gray-800">
            Edit User
          </Typography>
        </div>
        <form onSubmit={handleSubmit(editUser)} className="flex flex-col gap-2">
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
            <FormRadio
              name="gender"
              label="Gender"
              control={control}
              row
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
            {/* <FormField
              name="gender"
              label="Gender"
              select
              control={control}
              fullWidth
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </FormField> */}

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

            {/* <FormField
              name="role"
              control={control}
              label="Select Role"
              select
              fullWidth
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Parents">Parents</MenuItem>
            </FormField> */}
          </div>

          {selectedRole?.toUpperCase() === "STUDENT" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormSelect
                name="parentId"
                label="Select Parent (Optional)"
                control={control}
                options={allParents.map((parentData) => ({
                  value: String(parentData.id),
                  label: `${parentData.name} (${parentData.email})`,
                }))}
              />
              {/* <FormField
                name="parentId"
                label="Select Parent (Optional)"
                select
                control={control}
                fullWidth
              >
                <MenuItem value="">None</MenuItem>

                {allParents?.length > 0 ? (
                  allParents.map((parentData) => (
                    <MenuItem key={parentData.id} value={String(parentData.id)}>
                      {parentData.name} ({parentData.email})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="none" disabled>
                    No parents available
                  </MenuItem>
                )}
              </FormField> */}

              <FormSelect
                name="feeType"
                label="Select Fee Type"
                control={control}
                options={[
                  { value: "Monthly", label: "Monthly" },
                  { value: "Half-Yearly", label: "Half-Yearly" },
                  { value: "Annual", label: "Annual" },
                ]}
              />

              {/* <FormField
                name="feeType"
                label="Select Fee Type"
                select
                control={control}
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select
                </MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Half-Yearly">Half-Yearly</MenuItem>
                <MenuItem value="Annual">Annual</MenuItem>
              </FormField> */}
            </div>
          ) : null}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              name="state"
              label="State"
              type="text"
              control={control}
              placeholder="Enter state"
              fullWidth
            />
            {/* Postal Code */}
            <FormField
              name="postalCode"
              label="Postal Code"
              type="text"
              control={control}
              placeholder="Enter postal code"
              fullWidth
            />
          </div>

          {/* Submit */}
          <Box className="flex flex-col gap-3 mt-2">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Update User
            </Button>

            <Button
              className="rounded-xl py-3 font-semibold"
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </div>
    );
  }

  return null;
}
