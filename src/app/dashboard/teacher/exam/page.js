"use client";

import { Box, Grid, Typography, Chip, Container } from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import useLocalStorage from "use-local-storage";

export default function ExamScheduleTeacher() {
  const { data: session } = useSession();

  //
  const [examSchedule] = useLocalStorage("examSchedule", []);
  // const [classStudent] = useLocalStorage("classStudent", []);
  const [createdClass] = useLocalStorage("createdClass", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);

  //
  const myName = session?.user?.name;
  const myClass = createdClass?.find(
    (cls) =>
      (cls?.teacher || "").trim().toLowerCase() ===
      (myName || "").trim().toLowerCase(),
  );

  const myEnrollment = assignedCourses?.filter((cs) => cs.teacher === myName);

  const mySubjects = myEnrollment.map((course) => course.subjectname);
  const mySubjectExam = examSchedule?.filter((exam) =>
    mySubjects.includes(exam.subjectname),
  );

 
  const myExam = myClass
    ? examSchedule?.filter((exam) => exam.classname === myClass.classname)
    : [];

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
  ];

  return (
    <Container maxWidth="xl" elevation={3} className="rounded-2xl p-4 h-full flex flex-col">

    <Grid
      size={6}
      className="border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto "
    >
      <Typography className="justify-center text-center p-3 " variant="h4" >
        Exam Schedule
      </Typography>
      <Box className="justify-between flex flex-row bg-[#eff6ff]">
        <Typography variant="h6" className="mb-4 font-semibold p-3">
          {myClass && ` ${myClass.classname}`}
        </Typography>
      </Box>

      <ReusableTable data={myExam} columns={scheduleColumn} />

      {/*  */}
      <Box className="justify-between flex flex-row bg-[#eff6ff]">
        <Typography variant="h6" className="mb-4 font-semibold p-3">
          My Subjects
        </Typography>
      </Box>

      <ReusableTable data={mySubjectExam} columns={scheduleColumn} />
    </Grid>
    </Container>
  );
}
