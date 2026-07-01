"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Container,
} from "@mui/material";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { useRouter } from "next/navigation";
import { Assignment } from "@mui/icons-material";

export default function ViewAssignments() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData] = useLocalStorage("userData", []);
  const [assignments] = useLocalStorage("assignments", []);
  const [submitAssignment, setSubmitAssignment] = useLocalStorage(
    "submittedAssignment",
    [],
  );
  const findStudent = userData?.find(
    (user) => String(user.id) === String(session?.user?.id),
  );

  const myAssignments =
    assignments?.filter(
      (assignment) =>
        String(assignment.classname) === String(findStudent?.classname),
    ) || [];

  const assignmentColumns = [
    {
      id: "classname",
      label: "Class",
      render: (value) => (
        <Chip label={value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      id: "title",
      label: "Assignment Title",
      render: (value, row) => (
        <Typography className="font-medium text-gray-800">
          {row.title}
        </Typography>
      ),
    },
    {
      id: "description",
      label: "Description",
      render: (value, row) => (
        <Typography className="font-medium text-gray-800">
          {row.description}
        </Typography>
      ),
    },
    {
      id: "subjectname",
      label: "Subject",
      render: (value) => <Typography variant="body1">{value}</Typography>,
    },
    {
      id: "teacherName",
      label: "Teacher",
      render: (value) => <Typography variant="body1">{value}</Typography>,
    },

    {
      id: "dueDate",
      label: "Due Date",
      render: (value) => {
        const date = new Date(value);
        const isPastDue = date < new Date(new Date().setHours(0, 0, 0, 0));

        return (
          <Chip
            variant="outlined"
            color={isPastDue ? "error" : "success"}
            label={date.toLocaleDateString()}
          />
        );
      },
    },
    {
      id: "actions",
      label: "View",
      render: (_, row) => {
        const isSubmitted = submitAssignment?.some(
          (sub) =>
            String(sub.assignmentId) === String(row.id) &&
            String(sub.studentId) === String(findStudent?.id),
        );

        return (
          <>
            <Tooltip
              title={!isSubmitted ? "Open Assignment" : "Already Submitted"}
              className=""
              color={!isSubmitted ? "primary" : ""}
              onClick={() =>
                !isSubmitted
                  ? router.push(`/dashboard/student/assignment/${row.id}`)
                  : ""
              }
            >
              <IconButton>
                <Assignment />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
    <Container maxWidth="xl" elevation={3} className="rounded-2xl p-4 h-full flex flex-col">
      <Box className="flex flex-row items-center justify-between p-2">
        <Typography variant="h6" className="font-semibold text-gray-700 px-2">
          View Assignments
        </Typography>
      </Box>

      <Box className="w-full">
        <ReusableTable columns={assignmentColumns} data={myAssignments} />
      </Box>
    </Container>
    </>
  );
}

{
  /* <Box className="flex gap-3">
          <Typography variant="caption" className="self-center text-gray-500">
            Filter:
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

          <FormField
            fullWidth
            name="searchQuery"
            label="Search Title or Subject"
            onChange={handleSearchChange}
            control={control}
          />
        </Box> */
}
//   const { control, watch, setValue } = useForm({
//     mode: "onChange",
//     defaultValues: {
//       classname: "all",
//       searchQuery: "",
//     },
//   });

//   const selectedClass = watch("classname");
//   const searchQuery = watch("searchQuery");

//   const uniqueClasses = Array.from(
//     new Set(myAssignments.map((a) => a.classname)),
//   );
//   const filteredAssignments = myAssignments.filter((assignment) => {
//     const matchClass =
//       !selectedClass ||
//       selectedClass === "all" ||
//       String(assignment.classname) === String(selectedClass);
//     const matchSearch =
//       !searchQuery ||
//       assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       assignment.subjectname.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchClass && matchSearch;
//   });

//   const handleClassChange = (event) => {
//     setValue("classname", event.target.value);
//   };

//   const handleSearchChange = (event) => {
//     setValue("searchQuery", event.target.value);
//   };
