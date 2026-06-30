"use client";
import { toastMessage } from "@/components/reusable/reusableToast";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import useLocalStorage from "use-local-storage";
import AddUserPage from "../AddEditPages/adduserpage";
import ReusableTable from "../reusable/ReusableDataTable";
import Link from "next/link";
import FormField from "../reusable/reusableForm";
import { useForm } from "react-hook-form";

export default function AllTeachers() {
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const { data: session } = useSession();
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
    if (Number(teachers.length) === Number(1)) {
      toastMessage("Cannot delete only user having a single role", "error");
      return;
    }

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

      const updatedClasses = createdClass.filter(
        (classes) => classes.teacher !== findUser?.name,
      );

      const updatedAssignment = assignedCourses.filter(
        (course) => course.teacher !== findUser?.name,
      );

      const updatedClassStudent = classStudent.filter(
        (existing) => existing.student !== findUser?.name,
      );

      const updatedGrades = grades.filter(
        (grade) =>
          grade.teacherName !== findUser?.name &&
          grade.student !== findUser?.name,
      );

      const updatedParentChildData = parentChildData.filter(
        (record) =>
          String(record.parentId) !== String(deleteId) &&
          String(record.studentId) !== String(deleteId),
      );

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
  //
  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      usersName: "",
    },
  });

  const selectedUsersName = watch("usersName");

  const handleNameChange = (event) => {
    setValue("usersName", event.target.value);
  };
  //
  const finalFilteredStudents = teachers.filter((user) => {
    const filterUserNames =
      !selectedUsersName ||
      String(user.name)
        .toLowerCase()
        .includes(String(selectedUsersName).toLowerCase());
    return filterUserNames;
  });

  //

  const teachersDataColoums = [
    {
      id: "id",
      label: "Id",
      render: (value, row) => (
        <Typography
          className=""
          component={Link}
          href={`/dashboard/users/teachers/${row.id}`}
        >
          {row.id}
        </Typography>
      ),
    },
    { id: "firstname", label: "Name" },
    { id: "email", label: "Email" },
    { id: "age", label: "Age" },
    {
      id: "role",
      label: "Role",
      render: (value) => (
        <Chip label={value} size="small" variant="outlined" color="secondary" />
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
      <Paper elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
        <Box className="justify-between flex flex-row">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Teachers
          </Typography>
          <Box className="flex flex-row gap-2.5 justify-end">
            <Typography variant="caption" className="self-center">
              Filter
            </Typography>
            <FormField
              name="usersName"
              label="Filter by Name"
              onChange={handleNameChange}
              control={control}
            />
            <Button
              variant="outlined"
              onClick={() => router.push("/dashboard/admin/adduser")}
            >
              Add
            </Button>
          </Box>
        </Box>

        <ReusableTable
          columns={teachersDataColoums}
          data={finalFilteredStudents}
        />
        <Typography variant="h5" className="p-5 m-5 text-center">
          Total Teachers: {finalFilteredStudents.length}
        </Typography>
      </Paper>
    </>
  );
}
