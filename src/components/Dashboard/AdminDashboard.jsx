"use client";
import ReusableTable from "@/components/reusable/ReusableDataTable";
// import { toastMessage } from "@/components/reusable/reusableToast";
// import { Label } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
import React from "react";
import useLocalStorage from "use-local-storage";

export default function AdminDashboard() {
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [subject, setSubject] = useLocalStorage("subjects", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  // const { data: session } = useSession();
  const router = useRouter();

  const admin = userData.filter((user) => user.role.toUpperCase() === "ADMIN");
  const students = userData.filter(
    (user) => user.role.toUpperCase() === "STUDENT",
  );
  const teachers = userData.filter(
    (user) => user.role.toUpperCase() === "TEACHER",
  );
  const parents = userData.filter(
    (user) => user.role.toUpperCase() === "PARENTS",
  );

  const adminDataColumns = [
    { id: "id", label: "Id" },
    { id: "firstname", label: "Name" },
    { id: "email", label: "Email" },
  ];
  //
  const studentsDataColumns = [
    { id: "id", label: "Id" },
    { id: "firstname", label: "Name" },
    { id: "email", label: "Email" },
  ];
  //
  const teachersDataColumns = [
    { id: "id", label: "Id" },
    { id: "firstname", label: "Name" },
    { id: "email", label: "Email" },
  ];

  //
  const parentsDataColumns = [
    { id: "id", label: "Id" },
    { id: "firstname", label: "Name" },
    { id: "email", label: "Email" },
    {
      id: "studentNames",
      label: "Children",
      render: (value) => value?.length ?? 0,
    },
  ];

  //
  const subjectsDataColumns = [
    { id: "subjectname", label: "Name" },
    { id: "subjectcode", label: "Code" },
  ];

  //
  const classesDataColumns = [
    { id: "classname", label: "Class" },
    { id: "teacher", label: "Teacher" },
  ];
  //

  const assignedClassDataColumns = [
    { id: "subjectname", label: "Subject" },
    { id: "classname", label: "Class" },
    { id: "teacher", label: "Teacher" },
  ];

  //
  const assignedCStudentDataColumns = [
    { id: "student", label: "Student" },
    { id: "rollno", label: "Roll No" },
    { id: "classname", label: "Class" },
    { id: "teacher", label: "Teacher" },
  ];

  return (
    <>
      <Container maxWidth="false" className="mt-8 px-4 pb-12">
        <Box className="mb-8 border-b border-gray-100 pb-4 text-center ">
          <Typography
            variant="h4"
            className="font-bold tracking-wide text-gray-800 "
          >
            Dashboard
          </Typography>

          <Typography variant="body1" className="text-gray-500 mt-1">
            School Management System Analytics
          </Typography>
        </Box>

        <Grid container spacing={3} className="mb-8">
          {[
            {
              title: "Total User",
              value: userData.length,
              color: "#3c6382",
              path: "/dashboard/users",
            },
            {
              title: "Admins",
              value: admin.length,
              color: "#2563eb",
              path: "/dashboard/users?role=admin",
            },
            {
              title: "Students",
              value: students.length,
              color: "#059669",
              path: "/dashboard/users?role=student",
            },
            {
              title: "Teachers",
              value: teachers.length,
              color: "#9333ea",
              path: "/dashboard/users?role=teacher",
            },
            {
              title: "Parents",
              value: parents.length,
              color: "#80913b",
              path: "/dashboard/users?role=parents",
            },
            {
              title: "Subjects",
              value: subject.length,
              color: "#d97706",
              path: "/dashboard/admin/allsubject",
            },
            {
              title: "Classes",
              value: createdClass.length,
              color: "#64748b",
              path: "/dashboard/admin/allclasses",
            },
          ].map((item, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <Box
                onClick={() => router.push(item.path)}
                sx={{
                  bgcolor: `${item.color}`,
                  color: "white",
                  borderRadius: 2,
                }}
                elevation={1}
                className={`items-center text-center cursor-pointer p-5 rounded-2xl w-35 text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 `}
              >
                <Typography
                  variant="caption"
                  className="opacity-90 tracking-wider  font-medium mb-2"
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h4"
                  className="opacity-90 tracking-wider  font-medium mb-2"
                >
                  {item.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Users Tables */}
        <Grid container spacing={2} className="mb-4 justify-center self-start">
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Total Admins: {admin.length}
              </Typography>
            </Box>
            <ReusableTable columns={adminDataColumns} data={admin} />
          </Grid>

          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Total Students: {students.length}
              </Typography>
            </Box>
            <ReusableTable columns={studentsDataColumns} data={students} />
          </Grid>
        </Grid>

        {/* Teachers and Parents Tables */}
        <Grid container spacing={2} className="mb-4 justify-center">
          {/* Teaachers */}
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
          <  Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Total Teachers: {teachers.length}
              </Typography>
            </Box>
            <ReusableTable columns={teachersDataColumns} data={teachers} />
          </Grid>

          {/*Parents  */}

          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Total Parents: {parents.length}
              </Typography>
            </Box>
            <ReusableTable columns={parentsDataColumns} data={parents} />
          </Grid>
        </Grid>

        {/* Subjects and Classes Tables */}
        <Grid container spacing={2} className=" mb-4 justify-center">
          {/*Subjects  */}
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Total Subjects: {subject.length}
              </Typography>
            </Box>
            <ReusableTable columns={subjectsDataColumns} data={subject} />
          </Grid>

          {/*Classes  */}
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Total Classes: {createdClass.length}
              </Typography>
            </Box>
            <ReusableTable columns={classesDataColumns} data={createdClass} />
          </Grid>
        </Grid>

        {/* Students  in class and Assigned Courses */}
        <Grid container spacing={2} className=" mb-4 justify-start">
          {/*Students in class  */}
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Student in Classes :{classStudent.length}
              </Typography>
            </Box>
            <ReusableTable
              columns={assignedCStudentDataColumns}
              data={classStudent}
            />
          </Grid>
          {/* Assigned Courses */}{" "}
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                Assigned Courses: {assignedCourses.length}
              </Typography>
            </Box>
            <ReusableTable
              columns={assignedClassDataColumns}
              data={assignedCourses}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
