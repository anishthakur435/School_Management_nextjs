"use client";
import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { Label } from "@mui/icons-material";

export default function StudentAttendance() {
  const { data: session } = useSession();

  const [classStudent] = useLocalStorage("classStudent", []);
  const [attendance] = useLocalStorage("attendance", []);

  const studentName = session?.user?.name || "";
  const studentEmail = session?.user?.email;

  const myEnrollment = classStudent?.find(
    (cs) => cs.student === studentName || cs.studentEmail === studentEmail,
  );
  const myClassName = myEnrollment?.classname;

  const myClassRecords =
    attendance?.filter((record) => record.classname === myClassName) || [];

  const structuralRecords = myClassRecords.map((record) => {
    const isPresent = record.presentStudents?.includes(studentName) ?? false;

    return {
      ...record,
      personalStatus: isPresent ? "Present" : "Absent",
    };
  });

  const totalDays = structuralRecords.length;
  const daysPresent = structuralRecords.filter(
    (r) => r.personalStatus === "Present",
  ).length;
  const daysAbsent = totalDays - daysPresent;
  const personalAttendancePercentage =
    totalDays > 0 ? ((daysPresent / totalDays) * 100).toFixed(0) : "100";

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
        <Chip
          color={value === "Present" ? "success" : "error"}
          label={value}
          className="transition-all duration-500 hover:scale-105 hover:-translate-y-1"
        />
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

  return (
    <Container maxWidth="xl" className="mt-8 px-4 pb-12">
      <Box className="mb-6 border-b border-gray-100 pb-4">
        <Typography
          variant="h4"
          className="font-bold text-gray-900 tracking-tight"
        >
          My Attendance
        </Typography>
        <Typography variant="body1" className="text-gray-500 mt-1">
          {myClassName
            ? `Enrolled in ${myClassName}`
            : "Not assigned to any class"}
        </Typography>
      </Box>

      <Grid container spacing={3} className="mb-8">
        {[
          {
            title: "Total Working Days",
            value: totalDays,
            color: "bg-gradient-to-br from-blue-500 to-blue-700",
          },
          {
            title: "Days Present",
            value: daysPresent,
            color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
          },
          {
            title: "Days Absent",
            value: daysAbsent,
            color: "bg-gradient-to-br from-rose-500 to-rose-700",
          },
          {
            title: "Attendance Rate",
            value: `${personalAttendancePercentage}%`,
            color:
              Number(personalAttendancePercentage) < 75
                ? "bg-gradient-to-br from-orange-500 to-red-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-600",
          },
        ].map((item, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Box
              elevation={2}
              className={`p-5 w-48  h-full rounded-2xl text-white ${item.color} shadow-sm  justify-between transition-all duration-300 hover:scale-105 hover:-translate-y-2`}
            >
              <Typography
                variant="caption"
                className="opacity-90 tracking-wider uppercase font-medium"
              >
                {item.title}
              </Typography>
              <Typography variant="h4" className="font-bold mt-2">
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid
        size={12}
        className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
      >
        <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
          <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
            Daily Attendance History
          </Typography>
        </Box>
        <ReusableTable
          columns={studentRecordDataColoumns}
          data={structuralRecords}
        />
      </Grid>
    </Container>
  );
}
