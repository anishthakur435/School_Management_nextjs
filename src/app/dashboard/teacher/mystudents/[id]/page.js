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
import { useParams, useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";

export default function StudentDetails() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();

  const [userData] = useLocalStorage("userData", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [grades] = useLocalStorage("grades", []);
  const [attendance] = useLocalStorage("attendance", []);

  const findUserStudent = classStudent.find(
    (user) => String(user.id) === String(id),
  );
  // const id = "23443";

  const findStudent = userData.find(
    (user) => String(user.name) === String(findUserStudent.student),
  );

  if (!session) return null;

  if (!findStudent)
    return <Typography className="p-4">Student not found.</Typography>;

  //
  const studentName =
    findStudent.name || `${findStudent.firstname} ${findStudent.lastname}`;
  const studentEmail = findStudent.email;

  //
  const myEnrollment = classStudent?.find(
    (cs) => cs.student === studentName || cs.studentEmail === studentEmail,
  );

  const myClassName = myEnrollment?.classname;
  const myRollNo = myEnrollment?.rollno;

  const myCourses =
    assignedCourses?.filter((course) => course.classname === myClassName) || [];

  const myGrades =
    grades?.filter((grade) => grade.student === studentName) || [];

  const myAttendance =
    attendance?.filter((att) => att.classname === myClassName) || [];

  const structuralRecords = myAttendance.map((record) => {
    const isPresent = record.presentStudents?.includes(studentName) ?? false;
    return {
      ...record,
      personalStatus: isPresent ? "Present" : "Absent",
    };
  });

  const totalDays = structuralRecords.length;

  const presentDays = structuralRecords.filter(
    (a) => a.personalStatus === "Present",
  ).length;
  const daysAbsent = totalDays - presentDays;
  const personalAttendancePercentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(0) : "100";

  //
  const myGradesColumnData = [
    { id: "subjectname", label: "Subject" },
    { id: "teacherName", label: "Teacher" },
    {
      id: "marks",
      label: "Marks",
      render: (value, row) => (
        <Chip
          label={`${row.marks || 0} / ${row.maxmarks}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      id: "percentage",
      label: "Percentage",
      render: (value) => (
        <Chip label={`${value || "—"}%`} size="small" color="success" />
      ),
    },
    {
      id: "gradeAwarded",
      label: "Grade",
      render: (value) => (
        <Chip label={value || "—"} size="small" color="info" />
      ),
    },
    {
      id: "feedback",
      label: "Feedback",
      render: (value) => (
        <Typography variant="body2" color="textSecondary">
          {value || "No Feedback"}
        </Typography>
      ),
    },
  ];

  //
  const studentRecordDataColoumns = [
    { id: "date", label: "Date" },
    {
      id: "classname",
      label: "Classname",
      render: (value) => (
        <Chip label={value} size="small" variant="outlined" color="primary" />
      ),
    },
    {
      id: "personalStatus",
      label: "Status",
      render: (value) => (
        <Chip color={value === "Present" ? "success" : "error"} label={value} />
      ),
    },
    {
      id: "presentCount",
      label: "Class Availability",
      render: (value, row) => {
        const present = Number(row.presentCount) || 0;
        const total = Number(row.totalStudents) || 1;
        const classPercentage = ((present / total) * 100).toFixed(0);
        return (
          <>
            <Typography variant="body2" className="text-gray-700 font-medium">
              {present} / {total || 0} present
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Class Average: {classPercentage}%
            </Typography>
          </>
        );
      },
    },
  ];

  if (session?.user?.role?.toUpperCase() === "TEACHER") {
    return (
      <Container maxWidth="lg" className="mt-6 mb-12 gap-5 grid ">
        <Box className=" flex flex-row justify-between">
          <Typography
            variant="h4"
            fontWeight="bold"
            className="text-gray-800 mb-6 px-2 text-center"
          >
            Student Overview
          </Typography>
          <Box className="justify-end">
            <Button
              color="secondary"
              size="medium"
              variant="contained"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* student card */}
        <Box className="rounded-2xl border border-slate-200 overflow-hidden">
          <Box className="px-8 py-7 flex-col flex justify-between bg-gradient-to-tr from-[#85afdb]">
            <Box className="flex flex-col lg:flex-row lg:items-center gap-6">
              <Avatar
                alt={studentName}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2.5rem",
                  bgcolor: "#546de5",
                }}
              >
                {studentName.charAt(0).toUpperCase()}
              </Avatar>
              <Box className="rounded-2xl  border-gray-100  p-5  transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  className="text-gray-900"
                >
                  {studentName}
                </Typography>

                <Typography variant="body1" className="text-black mt-1">
                  {myClassName
                    ? `Enrolled in ${myClassName}`
                    : "Not assigned to any class"}
                </Typography>
                <Typography variant="body1" className="text-black mt-1">
                  {myRollNo ? `  ${myRollNo}` : " Not assigned  Roll No."}
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
                {studentEmail}
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
                {findStudent.contact}
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
                {findStudent.address
                  ? `${findStudent.address}, ${findStudent.city}, ${findStudent.state}`
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
                {findStudent.age ?? "N/A"}
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
                {findStudent.gender ?? "N/A"}
              </Typography>
            </Box>
            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Parents
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findStudent.parentName || "Not Assigned"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* attendance */}
        <Box className="rounded-2xl border border-slate-200 overflow-hidden">
          <Box className="px-6 py-5 border-b border-gray-100">
            <Typography variant="h6" className="font-bold text-gray-800 mb-4">
              Daily Attendance
            </Typography>

            <Grid container spacing={3} className="mb-8">
              {[
                { title: "Total Days", value: totalDays, color: "bg-blue-600" },
                {
                  title: "Days Present",
                  value: presentDays,
                  color: "bg-emerald-600",
                },
                {
                  title: "Days Absent",
                  value: daysAbsent,
                  color: "bg-rose-600",
                },
                {
                  title: "Attendance Rate",
                  value: `${personalAttendancePercentage}%`,
                  color:
                    Number(personalAttendancePercentage) < 75
                      ? "bg-amber-500"
                      : "bg-indigo-600",
                },
              ].map((item, index) => (
                <Grid xs={12} sm={6} md={3} key={index}>
                  <Box
                    elevation={1}
                    className={`p-5 rounded-2xl text-white ${item.color} text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 `}
                  >
                    <Typography
                      variant="caption"
                      className="opacity-90 tracking-wider uppercase font-medium mb-2"
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="h3" className="font-bold">
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <ReusableTable
            columns={studentRecordDataColoumns}
            data={structuralRecords}
          />
        </Box>

        {/*  */}
        <Box className="rounded-2xl border border-slate-200 overflow-hidden">
          <Box className="px-6 py-5 border-b border-gray-100 ">
            <Typography variant="h6" className="font-bold text-gray-800">
              Grades
            </Typography>

            <ReusableTable columns={myGradesColumnData} data={myGrades} />
          </Box>
        </Box>
      </Container>
    );
  }

  return null;
}
