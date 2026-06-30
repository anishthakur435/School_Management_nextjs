"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import StudentDashboard from "@/components/Dashboard/StudentDashboard";
import TeacherDashboard from "@/components/Dashboard/TeacherDashboard";
import ParentsDashboard from "@/components/Dashboard/ParentsDashboard";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import LibraryDashboard from "@/components/Dashboard/LibrarianDashboard";

export default function Dashboard() {
  const { data: session, status } = useSession();

  const userRole = session?.user?.role?.toLowerCase();

  if (status === "loading") {
    return (
      <Box className="flex items-center justify-center h-full bg-gray-50">
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  switch (userRole) {
    case "student":
      return <StudentDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "parents":
    case "parent":
      return <ParentsDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "librarian":
      return <LibraryDashboard />;
    default:
      return (
        <Box className="flex items-center justify-center h-full bg-gray-50">
          <Typography variant="h6">Error: Unrecognized User Role</Typography>
        </Box>
      );
  }
}
