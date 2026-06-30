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
import EditIcon from "@mui/icons-material/Edit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "../reusable/ReusableDataTable";
import { useForm } from "react-hook-form";
import FormField from "../reusable/reusableForm";
import FormSelect from "../reusable/ResuableSelect";

export default function AllClassesPage() {
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const router = useRouter();
  // Edit Class
  const handleEditClass = (editId) => {
    router.push(`/dashboard/admin/addclass/edit/${editId}`);
  };

  // Delete Class
  const handleDeleteClass = (deleteId) => {
    const findClass = createdClass.find((cls) => cls.id == deleteId);
    if (findClass) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this class?",
      );

      if (isConfirmed) {
        const updatedClasses = createdClass.filter(
          (cls) => cls.id !== deleteId,
        );
        const updatedAssignment = assignedCourses.filter(
          (course) => course.classname !== findClass.classname,
        );
        const updatedClassStudent = classStudent.filter(
          (student) => student.classname !== findClass.classname,
        );

        setCreatedClass(updatedClasses);
        setAssignedCourses(updatedAssignment);
        setClassStudent(updatedClassStudent);

        toastMessage("Class deleted successfully", "success");
      } else {
        toastMessage("Cancelled", "info");
      }
    }
  };

  //
  const { control, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      classname: "all",
      teacherName: "",
    },
  });

  const uniqueClasses = Array.from(
    new Set(createdClass.map((classDetails) => classDetails.classname)),
  );

  const selectedClass = watch("classname");
  const selectedTeacherName = watch("teacherName");

  const handleClassChange = (event) => {
    setValue("classname", event.target.value);
  };

  const handleTeacherNameChange = (event) => {
    setValue("teacherName", event.target.value);
  };

  const finalClassDetails = createdClass.filter((courses) => {
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

  //
  const classesDataColoums = [
    { id: "classname", label: "Class" },
    { id: "teacher", label: "Teacher" },
    {
      id: "id",
      label: "Action",
      render: (value, row) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="info" onClick={() => handleEditClass(row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDeleteClass(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Paper elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
        <Box className="flex flex-row justify-between">
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Classes
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
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => router.push("/dashboard/admin/addclass")}
            >
              Add Class
            </Button>
          </Box>
        </Box>
        <ReusableTable data={finalClassDetails} columns={classesDataColoums} />
        <Typography variant="h5" className="p-5 m-5 text-center">
          Total Classes: {finalClassDetails.length}
        </Typography>
      </Paper>
    </>
  );
}
