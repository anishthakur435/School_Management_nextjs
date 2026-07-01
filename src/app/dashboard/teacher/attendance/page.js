"use client";

import React from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
} from "@mui/material";

import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { Label } from "@mui/icons-material";

export default function AttendancePage() {
  const { data: session } = useSession();

  const [userData] = useLocalStorage("userData", []);
  const [attendance] = useLocalStorage("attendance", []);

  const findTeacher = userData.find(
    (user) => String(user.id) === String(session?.user?.id),
  );

  const myAttendanceRecords = attendance.filter(
    (record) => record.teacherName === findTeacher?.name,
  );

  const StudentAttendanceColoums = [
    { id: "date", label: "Date" },
    {
      id: "classname",
      label: "Class",
      render: (value, row) => (
        <Chip
          label={row.classname}
          size="small"
          variant="outlined"
          color="info"
        />
      ),
    },
    {
      id: "presentCount",
      label: "Present",
      render: (value, row) => {
        const present = Number(row.presentCount) || 0;
        const total = Number(row.totalStudents) || 1;

        return (
          <Chip label={`${present}/${total}`} size="small" variant="outlined" />
        );
      },
    },
    {
      id: "attendance",
      label: "Attendance",
      render: (value, row) => {
        const present = Number(row.presentCount) || 0;
        const total = Number(row.totalStudents) || 1;
        const percentage = ((present / total) * 100).toFixed(0);
        const colorType = percentage < 75 ? "error" : "success";
        return (
          <Chip
            label={`${percentage}%`}
            size="small"
            variant="outlined"
            color={colorType}
          />
        );
      },
    },
  ];

  return (
    <>
      <Container
        maxWidth="xl"
       
        className="rounded-2xl p-4 h-full flex flex-col"
      >
        <Box className="w-full p-4 h-full">
          <CardContent className="p-6 md:p-8">
            <Box className="flex items-center justify-between mb-6">
              <Box>
                <Typography variant="h5" className="font-bold text-gray-800">
                  Attendance History
                </Typography>

                <Typography variant="body2" className="text-gray-500 mt-1">
                  Previous attendance records and statistics
                </Typography>
              </Box>

              <Chip
                label={`${myAttendanceRecords.length} Records`}
                color="info"
              />
            </Box>

            <ReusableTable
              columns={StudentAttendanceColoums}
              data={myAttendanceRecords}
            />
          </CardContent>
        </Box>
        <Typography variant="h5" className="p-5 m-5 text-center">
          Total Attendance Records: {myAttendanceRecords.length}
        </Typography>
      </Container>
    </>
  );
}
