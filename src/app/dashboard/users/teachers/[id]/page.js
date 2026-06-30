"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Container,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import Link from "next/link";

export default function TeacherDetails() {
  const { data: session } = useSession();
  const { id } = useParams();
  const [userData] = useLocalStorage("userData", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [grades] = useLocalStorage("grades", []);
  const [attendance] = useLocalStorage("attendance", []);

  const findTeacher = userData.find((user) => String(user.id) === String(id));

  console.log("findTeacher", findTeacher);

  if (!session) return null;

  if (!findTeacher)
    return <Typography className="p-4">Student not found.</Typography>;

  //
  const teacherName =
    findTeacher.name || `${findTeacher.firstname} ${findTeacher.lastname}`;
  const teacherEmail = findTeacher.email;
  // console.log("teacherName", teacherName);
  const myClassName = findTeacher.classname;
  // console.log("myClassName", myClassName);

  const myStudents = classStudent.filter(
    (student) => String(student.teacher) === String(findTeacher?.name),
  );
  // console.log("myStudents", myStudents);

  const findStudent = classStudent.filter(
    (student) => String(student.teacher) === String(findTeacher?.name),
  );
  // console.log("findStudent", findStudent);

  const myAssignedCourse = assignedCourses.filter(
    (course) => course.teacher === teacherName,
  );
  // console.log("myAssignedCourse", myAssignedCourse);

  //students teaching
  const teacherssColoum = [
    {
      id: "student",
      label: "Student Name",
      render: (value, row) => {
        const studentUser = userData.find((user) => user.name === row.student);
        return (
          <Typography
            className=""
            component={Link}
            href={`/dashboard/users/students/${studentUser.id}`}
          >
            {row.id}
          </Typography>
        );
      },
    },
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" color="info" variant="outlined" />
      ),
    },
    { id: "rollno", label: "Roll Number" },
  ];

  //course and class
  const courseColoumnData = [
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" variant="outlined" color="primary" />
      ),
    },
    { id: "subjectname", label: "Subject" },
  ];

  if (session?.user?.role?.toUpperCase() === "ADMIN") {
    return (
      <Container maxWidth="lg" className="mt-6 mb-12 gap-5 grid ">
        <Box className=" flex flex-row justify-between">
          <Typography
            variant="h4"
            fontWeight="bold"
            className="text-gray-800 mb-6 px-2 text-center"
          >
            Teacher Overview
          </Typography>
          <Box className="justify-end">
            <Button
              color="primary"
              size="medium"
              variant="contained"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Box>
        </Box>
        {/* teacher card */}
        <Box className="rounded-2xl border border-slate-200 overflow-hidden">
          <Box className="px-8 py-7 flex-col flex justify-between bg-gradient-to-tr from-[#85afdb]">
            <Box className="flex flex-col lg:flex-row lg:items-center gap-6">
              <Avatar
                alt={teacherName}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2.5rem",
                  bgcolor: "#fdde5",
                }}
              >
                {teacherName.charAt(0).toUpperCase()}
              </Avatar>

              <Box className="rounded-2xl   border-gray-100  p-5  text-white  ">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  className="text-black transition-all duration-200 hover:scale-105 "
                >
                  {teacherName}
                </Typography>
                <Typography
                  variant="body1"
                  className="text-black mt-1 transition-all duration-200 hover:scale-105"
                >
                  {myClassName
                    ? `Head teacher of : ${myClassName}`
                    : "Not assigned any class"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 hover:bg-[#c3ddf12b]">
            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Email
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1 break-all"
              >
                {teacherEmail}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Contact
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findTeacher.contact}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findTeacher.address
                  ? `${findTeacher.address}, ${findTeacher.city}, ${findTeacher.state}`
                  : "Address N/A"}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Age
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findTeacher.age}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Gender
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findTeacher.gender}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/*  */}
        <Box>
          <Box className="flex flex-row items-center justify-between ">
            <Typography
              variant="h6"
              className="font-semibold mb-3 text-gray-700"
            >
              Students being taught
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <ReusableTable columns={teacherssColoum} data={myStudents} />
        </Box>
         {/*  */}
        <Box className="flex items-center justify-between ">
          <Typography variant="h6" className="font-semibold mb-3 text-gray-700">
            Assigned Classes ({myAssignedCourse.length})
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <ReusableTable columns={courseColoumnData} data={myAssignedCourse} />
      </Container>
    );
  }

  return null;
}
