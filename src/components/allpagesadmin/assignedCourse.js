"use client";
import { toastMessage } from "@/components/reusable/reusableToast";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "../reusable/ReusableDataTable";
import { useForm } from "react-hook-form";
import FormField from "../reusable/reusableForm";
import FormSelect from "../reusable/ResuableSelect";

export default function AssignedCoursePage() {
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const router = useRouter();

  // Delete  Assignment
  const handleDeleteCourseAssignment = (deleteId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to remove this course?",
    );
    if (isConfirmed) {
      const updatedAssignments = assignedCourses.filter(
        (course) => course.id !== deleteId,
      );
      setAssignedCourses(updatedAssignments);
      toastMessage("Course unassigned successfully", "success");
    } else {
      toastMessage("Cancelled", "info");
    }
  };

  //

  // filter
  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      classname: "all",
      teacherName: "",
    },
  });

  const uniqueClasses = Array.from(
    new Set(assignedCourses.map((teacherClass) => teacherClass.classname)),
  );

  const selectedClass = watch("classname");
  const selectedTeacherName = watch("teacherName");

  const handleClassChange = (event) => {
    setValue("classname", event.target.value);
  };

  const handleTeacherNameChange = (event) => {
    setValue("teacherName", event.target.value);
  };

  const finalAssignedCourses = assignedCourses.filter((courses) => {
    const filterTeachersNames =
      !selectedTeacherName ||
      String(courses.teacher)
        .toLowerCase()
        .includes(String(selectedTeacherName).toLowerCase());

    const filterUsersClass =
      !selectedClass ||
      selectedClass === "all" ||
      String(courses.classname)
        .toLowerCase()
        .includes(String(selectedClass).toLowerCase());

    return filterTeachersNames && filterUsersClass;
  });

  // Coloumn data
  const assignedClassDataColoums = [
    { id: "subjectname", label: "Subject" },
    { id: "classname", label: "Class" },
    { id: "teacher", label: "Teacher" },
    {
      id: "id",
      label: "Action",
      render: (value, row) => (
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => handleDeleteCourseAssignment(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Paper elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
        <Box className="flex flex-row justify-between">
          <Typography variant="h5" className="mb-4 font-semibold text-gray-700">
            Courses
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
              name="teacherName"
              label="Filter by Name"
              onChange={handleTeacherNameChange}
              control={control}
            />

            <Button
              variant="outlined"
              onClick={() => router.push("/dashboard/admin/course")}
            >
              Allocate Course
            </Button>
          </Box>
        </Box>

        <ReusableTable
          columns={assignedClassDataColoums}
          data={finalAssignedCourses}
        />
        <Typography variant="h5" className="p-5 m-5 text-center">
          Assigned Courses: {finalAssignedCourses.length}
        </Typography>
      </Paper>
    </>
  );
}

/* <TableContainer className="overflow-x-auto">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className="font-semibold">Subject</TableCell>
                <TableCell className="font-semibold">Class</TableCell>
                <TableCell className="font-semibold">Teacher</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.subjectname}</TableCell>
                  <TableCell>{course.classname}</TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        onClick={() => handleEditCourseAssignment(course.id)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCourseAssignment(course.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */
