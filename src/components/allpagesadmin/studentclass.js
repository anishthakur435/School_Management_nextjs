"use client";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "../reusable/ReusableDataTable";
import { useForm } from "react-hook-form";
import FormField from "../reusable/reusableForm";
import { useRouter } from "next/navigation";
import FormSelect from "../reusable/ResuableSelect";

export default function ClassDetailsPage() {
  const router = useRouter();
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);

  // filter
  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      classname: "all",
      teacherName: "",
      studentName: "",
    },
  });

  const uniqueClasses = Array.from(
    new Set(classStudent.map((teacherClass) => teacherClass.classname)),
  );

  const selectedClass = watch("classname");
  const selectedTeacherName = watch("teacherName");
  const selectedStudentName = watch("studentName");

  const handleClassChange = (event) => {
    setValue("classname", event.target.value);
  };

  const handleTeacherNameChange = (event) => {
    setValue("teacherName", event.target.value);
  };
  const handleStudentNameChange = (event) => {
    setValue("studentName", event.target.value);
  };
  const finalClassStudents = classStudent.filter((courses) => {
    const filterTeachersNames =
      !selectedTeacherName ||
      String(courses.teacher)
        .toLowerCase()
        .includes(String(selectedTeacherName).toLowerCase());

    const filterStudentsNames =
      !selectedStudentName ||
      String(courses.student)
        .toLowerCase()
        .includes(String(selectedStudentName).toLowerCase());

    const filterUsersClass =
      !selectedClass ||
      selectedClass === "all" ||
      String(courses.classname)
        .toLowerCase()
        .includes(String(selectedClass).toLowerCase());

    return filterTeachersNames && filterUsersClass && filterStudentsNames;
  });

  const assignedCStudentDataColoums = [
    { id: "classname", label: "Class" },
    { id: "student", label: "Student" },
    { id: "rollno", label: "Roll No" },
    { id: "teacher", label: "Teacher" },
  ];

  return (
    <>
      <Container maxWidth="xl" elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
        <Box className="flex flex-row justify-between">
          <Typography variant="h5" className="mb-4 font-semibold text-gray-700">
            Students
          </Typography>
          <Box className="flex flex-row gap-2.5 justify-end">
            <Typography variant="caption" className="self-center">
              Filter
            </Typography>

            <FormSelect
              name="classname"
              label="Filter by Class"
              control={control}
              onChange={handleClassChange}
              options={[
                {
                  value: "all",
                  label: "All Classes",
                },
                ...uniqueClasses.map((className) => ({
                  label: className,
                  value: className,
                })),
              ]}
            />
            {/* <FormControl>
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
            </FormControl> */}
            <FormField
              fullWidth
              name="teacherName"
              label="Filter by Teacher"
              onChange={handleTeacherNameChange}
              control={control}
            />
            <FormField
              fullWidth
              name="studentName"
              label="Filter by Student"
              onChange={handleStudentNameChange}
              control={control}
            />

            <Button
            fullWidth
              variant="outlined"
              onClick={() => router.push("/dashboard/admin/class")}
            >
              Enroll Students
            </Button>
          </Box>
        </Box>
        <ReusableTable
          columns={assignedCStudentDataColoums}
          data={finalClassStudents}
        />
        <Typography variant="h5" className="p-5 m-5 text-center">
          {" "}
          Student in Classes :{finalClassStudents.length}
        </Typography>
      </Container>
    </>
  );
}
