"use client";

import React from "react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { Box, Button, Chip, Typography } from "@mui/material";
import useLocalStorage from "use-local-storage";
import { toastMessage } from "@/components/reusable/reusableToast";

export default function ExamPage() {
  const [examSchedule, setExamSchedule] = useLocalStorage("examSchedule", []);

  // //
  const handleDelete = (deleteExamId) => {


    if (deleteExamId) {
      const updatedSchedule = examSchedule.filter(
        (exam) => exam.id !== deleteExamId,
      );
      setExamSchedule(updatedSchedule);
      toastMessage("exam schedule deleted","error")
    }
  };

  //
  const scheduleColumn = [
    { id: "classname", label: "Class" },
    { id: "subjectname", label: "Subject" },
    { id: "date", label: "Date" },
    {
      id: "startTime",
      label: "Start",
      render: (_, row) => (
        <Chip label={row.startTime} variant="outlined" color="info" />
      ),
    },
    {
      id: "endTime",
      label: "End",
      render: (_, row) => (
        <Chip label={row.endTime} variant="outlined" color="error" />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (value, row) => (
        <>
          <Button
            onClick={() => handleDelete(row.id)}
            color="error"
            variant="outlined"
            size="small"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
        <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
          Exam Schedule
        </Typography>
      </Box>
      <ReusableTable data={examSchedule} columns={scheduleColumn} />
    </>
  );
}
