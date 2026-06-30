"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Typography,
  Chip,
  Paper,
  FormControl,
  Select,
  Divider,
} from "@mui/material";

import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import { useForm } from "react-hook-form";
import FormField from "@/components/reusable/reusableForm";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import Link from "next/link";
import FormSelect from "@/components/reusable/ResuableSelect";

export default function MyStudents() {
  const { data: session } = useSession();
  const [userData] = useLocalStorage("userData", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const findTeacher = userData.find(
    (user) => String(user.id) === String(session?.user?.id),
  );
  const myStudents = classStudent.filter(
    (student) => String(student.teacher) === String(findTeacher?.name),
  );
  const findStudent = classStudent.filter(
    (student) => String(student.teacher) === String(findTeacher?.name),
  );

  //
  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      classname: "all",
      student: "",
    },
  });
  const uniqueClasses = Array.from(
    new Set(myStudents.map((student) => student.classname)),
  );
  const selectedClass = watch("classname");
  const filteredStudents = findStudent.filter((student) => {
    if (!selectedClass || selectedClass === "all") return true;
    return String(student.classname) === String(selectedClass);
  });

  const selectedName = watch("student");

  const finalFilteredStudents = filteredStudents.filter((student) => {
    if (!selectedName) return true;
    return String(student.student)
      .toLowerCase()
      .includes(String(selectedName).toLowerCase());
  });

  const handleClassChange = (event) => {
    setValue("classname", event.target.value);
  };

  const handleNameChange = (event) => {
    setValue("student", event.target.value);
  };

  const studentsColumn = [
    {
      id: "student",
      label: "Student Name",
      render: (value, row) => (
        <Typography
          className=""
          component={Link}
          href={`/dashboard/teacher/mystudents/${row.id}`}
        >
          {row.student}
        </Typography>
      ),
    },
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" color="info" variant="outlined" />
      ),
    },
    { id: "rollno", label: "Roll Number" },
  ];

  return (
    <>
      <Paper elevation={2} className="p-3 rounded-2xl h-full">
        <Box className="flex flex-row items-center justify-between mb-3">
          <Typography
            variant="h6"
            className="font-semibold mb-3 text-gray-700 px-2"
          >
            My Students
          </Typography>
          <Box className="flex gap-2">
            <Typography variant="caption" className="self-center">
              Filter
            </Typography>
            <FormSelect
              name="classname"
              label="Filter by Class"
              control={control}
              onChange={handleClassChange}
              options={[
                { value: "all", label: "All Classes" },
                ...uniqueClasses.map((classname) => ({
                  label: classname,
                  value: classname,
                })),
              ]}
            />
            {/* <FormControl>
              <Select
                id="class-filter"
                value={selectedClass}
                label="Filter by Class"
                fullWidth
                onChange={handleClassChange}
              >
                <MenuItem value="all">All Classes</MenuItem>
                {uniqueClasses.map((className) => (
                  <MenuItem key={className} value={className}>
                    {className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <FormField
            fullWidth
              name="student"
              label="Filter by Name"
              onChange={handleNameChange}
              control={control}
            />
          </Box>
        </Box>
        <Box className="w-full ">
          <ReusableTable
            columns={studentsColumn}
            data={finalFilteredStudents}
          />
        </Box>
         
      </Paper>
    </>
  );
}
