"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  //
  const [examSchedule] = useLocalStorage("examSchedule", []);

  //
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [grades] = useLocalStorage("grades", []);
  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email;

  //
  const studentDetails = userData.find(
    (user) => String(user.id) === String(session?.user?.id),
  );
  const isFeePending = studentDetails?.feeStatus?.toUpperCase() === "PENDING";
  const myEnrollment = classStudent?.find(
    (cs) => cs.student === studentName || cs.studentEmail === studentEmail,
  );
  const myClassName = myEnrollment?.classname || "Not Assigned";

  // ///
  const myExam = examSchedule.filter((exam) => exam.classname === myClassName);

  /////
  const myCourses =
    assignedCourses?.filter((course) => course.classname === myClassName) || [];

  const myGrades =
    grades?.filter(
      (grade) =>
        grade.student === studentName || grade.studentEmail === studentEmail,
    ) || [];

  const myClassmates =
    classStudent?.filter(
      (clsmate) =>
        clsmate.classname === myClassName && clsmate.student !== studentName,
    ) || [];

  // statsCard
  const statCards = [
    {
      label: "My Class",
      value: myClassName,
      bgClass: "bg-sky-100",
      textClass: "text-sky-800",
    },
    {
      label: "Enrolled Courses",
      value: myCourses.length,
      bgClass: "bg-green-100",
      textClass: "text-green-800",
    },
    {
      label: "Grades Received",
      value: myGrades.length,
      bgClass: "bg-amber-100",
      textClass: "text-amber-800",
    },
    {
      label: "Classmates",
      value: myClassmates.length,
      bgClass: "bg-purple-100",
      textClass: "text-purple-800",
    },
  ];

  //myCourseDataColumns
  const myCourseDataColumns = [
    { id: "subjectname", label: "Subject" },
    {
      id: "teacher",
      label: "Teacher",
      render: (value, row) => (
        <Chip label={value} size="small" color="primary" variant="outlined" />
      ),
    },
  ];

  // myGradeDataColumn
  const myGradeDataColumn = [
    { id: "subject", label: "Subject" },
    { id: "class", label: "Class" },

    {
      id: "percentage",
      label: "Percentage",
      render: (value) => (
        <Chip
          label={`${value}%` || "—"}
          size="small"
          color="success"
          className="transition-all duration-300 hover:scale-105 hover:-translate-y-1 "
        />
      ),
    },
    {
      id: "gradeAwarded",
      label: "Grade",
      render: (value) => (
        <Chip
          label={value || "—"}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
    { id: "feedback", label: "Feedback" },
  ];

  const myClassmatesDataColumns = [
    { id: "student", label: "Name" },
    { id: "rollno", label: "Roll No." },
  ];

  // /////
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

  // automatically updates feeStatus to pending is not paid
  useEffect(() => {
    if (!userData?.length) return;

    const today = new Date();

    const updatedUsers = userData.map((user) => {
      if (!user.feeDueDate) return user;

      const dueDate = new Date(user.feeDueDate);

      if (user.feeStatus?.toUpperCase() === "PAID" && today >= dueDate) {
        return {
          ...user,
          feeStatus: "Pending",
        };
      }

      return user;
    });

    setUserData(updatedUsers);
  }, []);

  return (
    <>
      <Container maxWidth="false" className="mt-8 px-4 pb-12">
        {/*  */}
        {isFeePending && (
          <Box className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-row justify-between items-center">
            <Typography variant="body1" className="text-red-800 font-medium">
              Your fee is pending.
            </Typography>

            <Button
              variant="contained"
              color="error"
              size="small"
              className=" rounded-lg px-4 py-1.5"
              onClick={() => router.push("/dashboard/student/fee")}
            >
              Pay Fee
            </Button>
          </Box>
        )}

        {/*  */}
        <Box className="mb-8 border-b border-gray-200 pb-4">
          <Typography variant="h5" className="font-bold">
            Welcome, {studentName}
          </Typography>
        </Box>

        <Grid container spacing={3} className="mb-8 items-center  ">
          {statCards.map((card, i) => (
            <Grid xs={12} sm={6} md={3} key={i}>
              <Box
                elevation={2}
                className={`p-4 rounded-2xl flex items-center gap-3 h-full ${card.bgClass}  ${card.textClass} transition-all duration-300 hover:scale-105 hover:-translate-y-1 `}
              >
                <Box className="p-2">
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    {card.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", lineHeight: 1.1 }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid
            size={12}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                My Grades ({myGrades.length})
              </Typography>
            </Box>
            <Divider className="mb-2" />
            <ReusableTable columns={myGradeDataColumn} data={myGrades} />
          </Grid>
          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                My Courses ({myCourses.length})
              </Typography>
            </Box>
            <ReusableTable columns={myCourseDataColumns} data={myCourses} />
          </Grid>

          <Grid
            size={6}
            className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
          >
            <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
              <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
                My Classmates ({myClassmates.length})
              </Typography>
            </Box>
            <ReusableTable
              columns={myClassmatesDataColumns}
              data={myClassmates}
            />
          </Grid>
        </Grid>
      </Container>

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
    </>
  );
}
