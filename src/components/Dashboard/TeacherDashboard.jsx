"use client";

import { Box, Container, Grid, Typography, Divider, Chip } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonIcon from "@mui/icons-material/Person";
import { useSession } from "next-auth/react";
import React from "react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";

export default function TeacherDashboard() {
  const { data: session } = useSession();

  const [userData] = useLocalStorage("userData", []);
  const [createdClass] = useLocalStorage("createdClass", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [grades] = useLocalStorage("grades", []);

  const findTeacher = userData.find(
    (teacher) => teacher.id == session?.user?.id,
  );

  const findTeacherCourse = assignedCourses.filter(
    (course) => course.teacher == findTeacher?.name,
  );

  const findClassAssigned = createdClass.filter(
    (teachingClass) => teachingClass.teacher === findTeacher?.name,
  );

  const findStudent = classStudent.filter(
    (students) => students.teacher === findTeacher?.name,
  );

  const myGrades = grades.filter(
    (grade) => grade.teacherName === findTeacher?.name,
  );
  const myStudents = classStudent.filter(
    (student) => String(student.teacher) === String(findTeacher?.name),
  );

  const statCards = [
    {
      label: "My Courses",
      value: findTeacherCourse.length,
      color: "bg-teal-600",
      icon: <MenuBookIcon sx={{ fontSize: 28, color: "white" }} />,
    },
    {
      label: "My Classes",
      value: findClassAssigned.length,
      color: "bg-violet-600",
      icon: <SchoolIcon sx={{ fontSize: 28, color: "white" }} />,
    },
    {
      label: "My Students",
      value: findStudent.length,
      color: "bg-amber-500",
      icon: <GroupsIcon sx={{ fontSize: 28, color: "white" }} />,
    },
    {
      label: "Grades Given",
      value: myGrades.length,
      color: "bg-sky-600",
      icon: <PersonIcon sx={{ fontSize: 28, color: "white" }} />,
    },
  ];

  //
  const teacherCourseDataColoumn = [
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" variant="outlined" color="primary" />
      ),
    },
    { id: "subjectname", label: "Subject" },
  ];
  const classAssignedDataColoumn = [
    { id: "teacher", label: "Teacher" },
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" variant="outlined" color="secondary" />
      ),
    },
  ];

  return (
    <Container maxWidth="xl" className="mt-8 px-4 pb-12">
      <Box className="mb-8 border-b border-gray-200 pb-4">
        <Typography variant="h5" className="font-bold ">
          Welcome, {findTeacher?.name || "Teacher"}
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} className="mb-8">
        {statCards.map((card, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Box
              elevation={3}
              className={`p-5 rounded-2xl w-32  text-white ${card.color} text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 `}
            >
              <Box>{card.icon}</Box>
              <Box>
                <Typography variant="caption">{card.label}</Typography>
                <Typography variant="h4" className="font-semibold">
                  {card.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid
          size={6}
          className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
        >
          <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
            <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
              Assigned Courses ({findTeacherCourse.length})
            </Typography>

            <Divider sx={{ mb: 2 }} />
          </Box>
          <ReusableTable
            columns={teacherCourseDataColoumn}
            data={findTeacherCourse}
          />
        </Grid>

        <Grid
          size={6}
          className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
        >
          <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
            <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
              Assigned Classes ({findClassAssigned.length})
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <ReusableTable
            columns={classAssignedDataColoumn}
            data={findClassAssigned}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
