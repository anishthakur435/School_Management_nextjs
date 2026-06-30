"use client";

import React from "react";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function ParentsDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData] = useLocalStorage("userData", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [grades] = useLocalStorage("grades", []);
  const [parentChildData] = useLocalStorage("parentChildData", []);
  const [attendance] = useLocalStorage("attendance", []);

  const parentEmail = session?.user?.email;
  const parentName = session?.user?.name;
  const parentId = session?.user?.id;

  const allStudents = userData.filter(
    (user) => String(user.role).toUpperCase() === "STUDENT",
  );

  const assignedStudentIds = parentChildData
    .filter((assignment) => {
      if (assignment.parentId && parentId) {
        return Number(assignment.parentId) === Number(parentId);
      }
      return false;
    })
    .map((assignment) => Number(assignment.studentId));

  const myChildren = allStudents.filter((student) => {
    if (student.parentId && parentId) {
      return Number(student.parentId) === Number(parentId);
    }
    return assignedStudentIds.includes(Number(student.id));
  });

  const parentsData = myChildren.length > 0;

  const childrenData = myChildren.map((child) => {
    const assignment = classStudent.find(
      (record) =>
        record.student === child.name || record.studentEmail === child.email,
    );

    const childGrades = grades.filter(
      (grade) =>
        grade.student === child.name || grade.studentEmail === child.email,
    );

    const childClasses = assignedCourses.filter(
      (course) => course.classname === assignment?.classname,
    );

    const numericGrades = childGrades
      .map((grade) => parseFloat(grade.percentage || grade.marks))
      .filter((value) => !Number.isNaN(value));

    const averageGrade =
      numericGrades.length > 0
        ? `${(
            numericGrades.reduce((sum, value) => sum + value, 0) /
            numericGrades.length
          ).toFixed(2)}%`
        : "N/A";

    const studentRecords =
      attendance?.filter(
        (record) => record.classname === assignment?.classname,
      ) || [];

    const totalDays = studentRecords.length;
    const daysPresent = studentRecords.filter((record) =>
      record.presentStudents?.includes(child.name),
    ).length;

    const payments = child.feeStatus;

    const attendancePercentage =
      totalDays > 0
        ? `${((daysPresent / totalDays) * 100).toFixed(0)}%`
        : "100%";

    return {
      id: child.id || child.email,
      studentName: child.name.trim(),
      email: child.email || "-",
      classname: assignment?.classname || "Not Assigned",
      rollno: assignment?.rollno || "N/A",
      teacher: assignment?.teacher || "TBD",
      courses: childClasses.length,
      attendancePercentage,
      childGrades,
      averageGrade,
      payments,
    };
  });

  const uniqueClasses = Array.from(
    new Set(
      childrenData
        .map((row) => row.classname)
        .filter((name) => name && name !== "Not Assigned"),
    ),
  );

  // view report card
  const handleViewReportCard = (id) => {
    router.push(`/dashboard/parents/${id}`);
  };

  const statCards = [
    {
      label: "Children",
      value: childrenData.length,
      icon: "👨‍👩‍👧‍👦",
      color: "bg-blue-100",
    },
    {
      label: "Classes Covered",
      value: uniqueClasses.length,
      icon: "🏫",
      color: "bg-amber-100",
    },
    {
      label: "Total Courses",
      value: childrenData.reduce((sum, row) => sum + row.courses, 0),
      icon: "📚",
      color: "bg-green-100",
    },
    {
      label: "Grades Posted",
      value: childrenData.reduce((sum, row) => sum + row.childGrades.length, 0),
      icon: "📝",
      color: "bg-red-100",
    },
  ];

  const childColumns = [
    { id: "studentName", label: "Student Name" },
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" color="primary" variant="outlined" />
      ),
    },
    { id: "rollno", label: "Roll No." },
    { id: "teacher", label: "Teacher" },
    {
      id: "courses",
      label: "Courses",
      render: (value) => (
        <Chip label={value} size="small" color="info" variant="outlined" />
      ),
    },
    {
      id: "attendancePercentage",
      label: "Attendance",
      render: (value) => {
        const numericVal = parseInt(value) || 100;
        const color =
          numericVal < 40 ? "error" : numericVal < 70 ? "warning" : "success";
        return (
          <Chip label={value} size="small" color={color} variant="filled" />
        );
      },
    },
    {
      id: "averageGrade",
      label: "Avg Grade",
      render: (value) => (
        <Chip label={value} size="small" color="secondary" variant="outlined" />
      ),
    },
    {
      id: "payments",
      label: "Payment",
      render: (value) => {
        const isPending = String(value).toLowerCase() === "pending";
        const color = isPending ? "error" : "success";
        return <Chip label={value} size="small" color={color} />;
      },
    },

    {
      id: "actions",
      label: "View Grade",
      render: (value, row) => (
        <Button
          onClick={() => handleViewReportCard(row.id)}
          className="transition-all duration-500 hover:scale-105 hover:-translate-z-1"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" className="mt-8 px-4 pb-12">
      <Box className="mb-8 border-b border-gray-200 pb-4">
        <Typography variant="h5" className="font-bold">
          Welcome, {parentName || "Parent"}
        </Typography>
      </Box>

      <Grid container spacing={3} className="mb-8">
        {statCards.map((card, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Box
              elevation={3}
              className={`p-4 rounded-2xl flex items-center gap-3 h-full ${card.color} transition-all duration-500 hover:scale-105 hover:-translate-y-1`}
            >
              <Box className="rounded-lg p-2 text-xl">{card.icon}</Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  className="block font-medium"
                >
                  {card.label}
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {card.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Main Core Dashboard Layout */}
      <Grid
        size={12}
        className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
      >
        <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
          <Typography variant="h6" className="mb-4 font-semibold px-3 p-3">
            {parentsData ? "My Children" : "Children Overview"} (
            {childrenData.length})
          </Typography>
        </Box>
        <ReusableTable columns={childColumns} data={childrenData} />
      </Grid>
    </Container>
  );
}
