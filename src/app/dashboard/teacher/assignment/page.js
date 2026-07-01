"use client";

import React from "react";
import { Box, Typography, Chip, Paper, Button, Container } from "@mui/material";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { useRouter } from "next/navigation";

export default function ViewAssignments() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData] = useLocalStorage("userData", []);
  const [assignments] = useLocalStorage("assignments", []);
  const [submitAssignment, setSubmitAssignment] = useLocalStorage(
    "submittedAssignment",
    [],
  );
  const findTeacher = userData?.find(
    (user) => String(user.id) === String(session?.user?.id),
  );
  const myAssignments =
    assignments?.filter(
      (assignment) => String(assignment.teacherId) === String(findTeacher?.id),
    ) || [];
  const assignmentColumns = [
    {
      id: "subjectname",
      label: "Subject",
      render: (value, row) => (
        <Typography
        className="cursor-pointer"
          variant="body1"
          onClick={() => router.push(`/dashboard/teacher/assignment/${row.id}`)}
        >
          {row.subjectname}
        </Typography>
      ),
    },
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
    // {
    //   id: "actions",
    //   label: "View",
    //   render: (_, row) => {
    //     const submissions = submitAssignment.filter(
    //       (sub) => String(sub.assignmentId) === String(row.id),
    //     );

    //     return (
    //       <Button
    //         variant="outlined"
    //         size="small"
    //         onClick={() =>
    //           router.push(`/dashboard/teacher/assignment/${row.id}`)
    //         }
    //       >
    //         Submissions
    //       </Button>
    //     );
    //   },
    // },
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

