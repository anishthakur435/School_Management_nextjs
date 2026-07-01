"use client";

import { Box, Container, Grid, Typography, Chip } from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import useLocalStorage from "use-local-storage";

export default function MyExamSchedule() {
  const { data: session } = useSession();


  const [examSchedule] = useLocalStorage("examSchedule", []);
  const [classStudent] = useLocalStorage("classStudent", []);

  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email;

  const myEnrollment = classStudent?.find(
    (cs) => cs.student === studentName || cs.studentEmail === studentEmail,
  );
  const myClassName = myEnrollment?.classname || "Not Assigned";
  const myExam = examSchedule.filter((exam) => exam.classname === myClassName);


  //   ////
  const scheduleColumn = [
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
  ];

  //   ////
  return (
    <>
    <Container maxWidth="xl" elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
      <Grid
        size={6}
        className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
      >
        <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
          <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
            Exam Schedule
          </Typography>
        </Box>
        <ReusableTable data={myExam} columns={scheduleColumn} />
      </Grid>
    </Container>
    </>
  );
}
