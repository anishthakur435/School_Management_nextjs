"use client";
import { toastMessage } from "@/components/reusable/reusableToast";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Container,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { useForm } from "react-hook-form";
import FormField from "@/components/reusable/reusableForm";
import Link from "next/link";
import FormSelect from "@/components/reusable/ResuableSelect";

export default function AllUsersContent() {
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const [parentChildData, setParentChildData] = useLocalStorage(
    "parentChildData",
    [],
  );
  const [grades, setGrades] = useLocalStorage("grades", []);

  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const teachers = userData.filter(
    (user) => user.role.toUpperCase() === "TEACHER",
  );
  const admin = userData.filter((user) => user.role.toUpperCase() === "ADMIN");
  const students = userData.filter(
    (user) => user.role.toUpperCase() === "STUDENT",
  );
  const parents = userData.filter(
    (user) => user.role.toUpperCase() === "PARENTS",
  );

  //
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Edit user
  const handleEdit = (editId) => {
    router.push(`/dashboard/admin/edit/${editId}`);
  };

  //// // Delete user
  const handleDelete = (deleteId) => {
    const findUser = userData.find((user) => user.id == deleteId);

    if (deleteId == 1 || deleteId == 2 || deleteId == 3 || deleteId == 4) {
      toastMessage("Default User Cannot be deleted", "error");
      return;
    }
    if (session?.user?.id == deleteId) {
      toastMessage("Cannot delete current user", "error");
      return;
    }
    //
    const userRole = findUser?.role?.toUpperCase();

    if (userRole === "PARENTS" && parents.length === 1) {
      toastMessage("Cannot delete the only parent in the system", "error");
      return;
    }
    if (userRole === "STUDENT" && students.length === 1) {
      toastMessage("Cannot delete the only student in the system", "error");
      return;
    }
    if (userRole === "TEACHER" && teachers.length === 1) {
      toastMessage("Cannot delete the only teacher in the system", "error");
      return;
    }
    if (userRole === "ADMIN" && admin.length === 1) {
      toastMessage("Cannot delete the only admin in the system", "error");
      return;
    }
    //

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    //
    if (isConfirmed) {
      let updatedUsers = userData.filter((user) => user.id !== deleteId);

      //
      if (findUser?.role?.toUpperCase() === "STUDENT" && findUser.parentId) {
        updatedUsers = updatedUsers.map((user) => {
          if (String(user.id) === String(findUser.parentId)) {
            const updatedIds = (user.studentIds || []).filter(
              (id) => String(id) !== String(deleteId),
            );
            const updatedNames = (user.studentNames || []).filter(
              (name) => name !== findUser.name,
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
      }
      //
      if (findUser?.role?.toUpperCase() === "PARENTS") {
        updatedUsers = updatedUsers.map((user) => {
          if (String(user.parentId) === String(deleteId)) {
            return {
              ...user,
              parentId: null,
              parentName: null,
            };
          }
          return user;
        });
      }
      // console.log("updatedUsers", updatedUsers);
      const updatedClasses = createdClass.filter(
        (classes) => classes.teacher !== findUser?.name,
      );
      // console.log("updatedClasses", updatedClasses);
      const updatedAssignment = assignedCourses.filter(
        (course) => course.teacher !== findUser?.name,
      );
      // console.log("updatedAssignment",updatedAssignment˝);

      const updatedClassStudent = classStudent.filter(
        (existing) => existing.student !== findUser?.name,
      );
      // console.log("updatedClassStudent", updatedClassStudent);

      const updatedGrades = grades.filter(
        (grade) =>
          grade.teacherName !== findUser?.name &&
          grade.student !== findUser?.name,
      );
      // console.log("updatedGrades",updatedGrades);

      const updatedParentChildData = parentChildData.filter(
        (record) =>
          String(record.parentId) !== String(deleteId) &&
          String(record.studentId) !== String(deleteId),
      );
      // console.log("updatedParentChildData", updatedParentChildData);

      setUserData(updatedUsers);
      setClassStudent(updatedClassStudent);
      setCreatedClass(updatedClasses);
      setAssignedCourses(updatedAssignment);
      setGrades(updatedGrades);
      setParentChildData(updatedParentChildData);

      toastMessage("User deleted successfully", "success");
    } else {
      toastMessage("Cancelled", "info");
    }
  };

  // filter  users
  const uniqueRoles = Array.from(new Set(userData.map((user) => user.role)));
  // console.log("uniqueRoles", uniqueRoles);

  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      user: "all",
      usersName: "",
    },
  });
  const selectedUser = watch("user");
  const selectedUsersName = watch("usersName");

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setValue("user", newRole);
    const params = new URLSearchParams(searchParams.toString());
    if (newRole == "all") {
      params.delete("role");
    } else {
      params.set("role", newRole);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const search = searchParams.get("role");
    if (search !== null) {
      setValue("user", search);
    }
  }, [searchParams, setValue]);

  //
  const handleNameChange = (event) => {
    setValue("usersName", event.target.value);
  };

  const finalFilteredUsers = userData.filter((user) => {
    const filterUserRoles =
      selectedUser === "all" ||
      user.role.toLowerCase() === selectedUser.toLowerCase();

    const filterUserNames =
      !selectedUsersName ||
      String(user.name)
        .toLowerCase()
        .includes(String(selectedUsersName).toLowerCase());

    return filterUserRoles && filterUserNames;
  });

  //
  const userColoumData = [
    {
      id: "id",
      label: "Id",
      render: (value, row) => (
        <Typography
          component={Link}
          href={
            row.role.toUpperCase() === "STUDENT"
              ? `/dashboard/users/students/${row.id}`
              : row.role.toUpperCase() === "TEACHER"
                ? `/dashboard/users/teachers/${row.id}`
                : row.role.toUpperCase() === "PARENTS"
                  ? `/dashboard/users/parents/${row.id}`
                  : `/dashboard/admin`
          }
        >
          {row.id}
        </Typography>
      ),
    },
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "contact", label: "Contact" },
    { id: "age", label: "Age" },
    {
      id: "role",
      label: "Role",
      render: (value) => (
        <Chip
          label={value}
          size="small"
          variant="outlined"
          color={
            value.toUpperCase() === "ADMIN"
              ? "success"
              : value.toUpperCase() === "TEACHER"
                ? "secondary"
                : value.toUpperCase() === "STUDENT"
                  ? "primary"
                  : "default"
          }
        />
      ),
    },
    {
      id: "action",
      label: "Action",
      render: (value, row) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="info" onClick={() => handleEdit(row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Container
        elevation={3}
        className="rounded-2xl p-4 h-full flex flex-col w-full"
      >
        <Box className="justify-between flex flex-row ">
          <Typography
            variant="h6"
            className="mb-4 font-semibold text-gray-70  px-2"
          >
            Users
          </Typography>

          <Box className="flex flex-row gap-2.5 justify-end">
            <Typography variant="caption" className="self-center">
              Filter
            </Typography>

            <FormSelect
              control={control}
              name="user"
              label="Filter by Role"
              onChange={handleRoleChange}
              options={[
                {
                  value: "all",
                  label: "All Users",
                },
                ...uniqueRoles.map((roleName) => ({
                  value: roleName.toLowerCase(),
                  label: roleName,
                })),
              ]}
            />
            {/* <FormControl>
              <Select
                id="user-filter"
                value={selectedUser}
                onChange={handleRoleChange}
              >
                <MenuItem value="all">All users</MenuItem>
                {uniqueRoles.map((roleName) => (
                  <MenuItem key={roleName} value={roleName.toLowerCase()}>
                    {roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <FormField
            fullWidth
              name="usersName"
              label="Filter by Name"
              onChange={handleNameChange}
              control={control}
            />
            <Button
            fullWidth
              variant="outlined"
              onClick={() => router.push("/dashboard/admin/adduser")}
            >
              Add User
            </Button>
          </Box>
        </Box>
        <ReusableTable columns={userColoumData} data={finalFilteredUsers} />
        <Typography variant="h5" className="p-5 m-5 text-center">
          Total Users: {finalFilteredUsers.length}
        </Typography>
      </Container>
    </>
  );
}
