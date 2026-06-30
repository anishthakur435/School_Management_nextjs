"use client";

import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { useForm } from "react-hook-form";
import FormField from "@/components/reusable/reusableForm";
import Link from "next/link";

export default function StudentGrading() {
  const { data: session } = useSession();
  const [userData] = useLocalStorage("userData", []);
  const [grades, setGrades] = useLocalStorage("grades", []);

  const findTeacher = userData.find(
    (user) => String(user.id) === String(session?.user?.id),
  );

  const myGrades = grades.filter(
    (grade) => grade.teacherName == findTeacher?.name,
  );
 
  //
  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      classname: "all",
      gradeName: "all",
      studentName: "",
    },
  });

  const uniqueClasses = Array.from(
    new Set(grades.map((classDetails) => classDetails.class)),
  );

  const uniqueGrade = Array.from(
    new Set(grades.map((grade) => grade.gradeAwarded)),
  );

  const selectedClass = watch("classname");
  const selectedGrade = watch("gradeName");
  const selectedStudentName = watch("studentName");

  const handleClassChange = (event) => {
    setValue("classname", event.target.value);
  };
  const handleGradeChange = (event) => {
    setValue("gradeName", event.target.value);
  };
  const handleStudentNameChange = (event) => {
    setValue("studentName", event.target.value);
  };

  const finalGrades = myGrades.filter((grade) => {
    const filterStudentsNames =
      !selectedStudentName ||
      String(grade.student)
        .toLowerCase()
        .includes(String(selectedStudentName).toLowerCase());

    const filteredGradeAwarded =
      selectedGrade === "all" || grade.gradeAwarded === selectedGrade;

    const filterStudentClass =
      !selectedClass ||
      selectedClass === "all" ||
      String(grade.class)
        .toLowerCase()
        .includes(String(selectedClass).toLowerCase());
    return filterStudentsNames && filteredGradeAwarded && filterStudentClass;
  });
  //
  const StudentGradeTableColumns = [
    {
      id: "student",
      label: "Student Name",
      render: (value, row) => (
        <Typography
          className=""
          component={Link}
          href={`/dashboard/teacher/grading/${row.id}`}
        >
          {row.student}
        </Typography>
      ),
    },
    {
      id: "class",
      label: "Class",
      render: (value) => <Chip label={value} size="small" variant="outlined" />,
    },
    { id: "exam", label: "Exam" },
    {
      id: "marks",
      label: "Marks",
      render: (value, row) => (
        <Chip
          label={`${row.marks} / ${row.maxmarks}`}
          size="small"
          variant="outlined"
          color="info"
        />
      ),
    },
    {
      id: "percentage",
      label: "Percentage",
      render: (value) => `${value}%`,
    },
    { id: "gradeAwarded", label: "Grade" },
    {
      id: "feedback",
      label: "Feedback",
      render: (value) => value || "—",
    },
  ];

  return (
    <Card elevation={3} className="rounded-3xl shadow-xl w-full h-full">
      <CardContent className="p-6">
        <Box className="flex flex-row justify-between">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700 px-2">
            Recorded Grade Reports
          </Typography>
          <Box className="flex flex-row gap-2.5 justify-end">
            <Typography variant="caption" className="self-center">
              Filter
            </Typography>
            <FormControl>
              <Select
                id="class-filter"
                value={selectedClass}
                onChange={handleClassChange}
              >
                <MenuItem value="all">All Classes</MenuItem>
                {uniqueClasses.map((className) => (
                  <MenuItem key={className} value={className}>
                    {className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <Select
                id="grade-filter"
                value={selectedGrade}
                onChange={handleGradeChange}
              >
                <MenuItem value="all">Grades</MenuItem>
                {uniqueGrade.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormField
              name="studentName"
              label="Filter by Student"
              onChange={handleStudentNameChange}
              control={control}
            />
          </Box>
        </Box>
        <Divider className="" />
        <ReusableTable columns={StudentGradeTableColumns} data={finalGrades} />

      </CardContent>
    </Card>
  );
}
