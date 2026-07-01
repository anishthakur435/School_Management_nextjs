"use client";
import { toastMessage } from "@/components/reusable/reusableToast";
import {

  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import React from "react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "../reusable/ReusableDataTable";

export default function AllSubjects() {
  const [subject, setSubject] = useLocalStorage("subjects", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const router = useRouter();
  // Edit Subject
  const handleEditSubject = (editId) => {
    router.push(`/dashboard/admin/addsubject/edit/${editId}`);
  };

  // Delete Subject
  const handleDeleteSubject = (deleteId) => {
    const findSubject = subject.find((subj) => subj.id == deleteId);

    if (findSubject) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this subject",
      );

      if (isConfirmed) {
        const updatedDeletedSubjects = subject.filter(
          (subj) => subj.id !== deleteId,
        );
        const updatedAssignments = assignedCourses.filter(
          (course) => course.subjectname !== findSubject.subjectname,
        );

        setSubject(updatedDeletedSubjects);
        setAssignedCourses(updatedAssignments);
        toastMessage("Subject deleted successfully", "success");
      } else {
        toastMessage("Cancelled", "info");
      }
    }
  };

  // filter

  //
  const subjectsDataColoums = [
    { id: "subjectname", label: "Name" },
    { id: "subjectcode", label: "Code" },
    {
      id: "id",
      label: "Action",
      render: (value, row) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="info" onClick={() => handleEditSubject(row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDeleteSubject(row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  return (
    <>
      <Container maxWidth="xl" elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
        <Box className="flex flex-row justify-between">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Subjects
          </Typography>

          <Button
            variant="outlined"
            onClick={() => router.push("/dashboard/admin/addsubject")}
          >
            Add Subject
          </Button>
        </Box>
        <ReusableTable columns={subjectsDataColoums} data={subject} />
        <Typography variant="h5" className="p-5 m-5 text-center">
          {" "}
          Total Subjects: {subject.length}
        </Typography>
      </Container>
    </>
  );
}
