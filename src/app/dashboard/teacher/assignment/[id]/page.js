"use client";

import { useParams, useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { Box, Button, Chip, Divider, Grid, Typography } from "@mui/material";

export default function AssignmentSubmissions() {
  const { id } = useParams();
  const route = useRouter();
  const [submittedAssignments] = useLocalStorage("submittedAssignment", []);
  const submissions = submittedAssignments.filter(
    (sub) => String(sub.assignmentId) === String(id),
  );

  const columns = [
    {
      id: "studentName",
      label: "Student",
    },
    {
      id: "classname",
      label: "Class",
    },
    {
      id: "answer",
      label: "Answer",
      render: (value) => (
        <Typography variant="body2" className="w-2xl max-h-25 overflow-auto">
          {value}
        </Typography>
      ),
    },
    {
      id: "submittedAt",
      label: "Submitted At",
      render: (value, row) => {
        const date = new Date(row.submittedAt).toLocaleDateString();
        return <Chip label={date} variant="outlined" color="success" />;
      },
    },
  ];

  return (
    <>
      <Grid
        size={6}
        className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto h-full"
      >
        <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
          <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
            Assignment Completed ({submissions.length})
          </Typography>
          <Box className="justify-end items-center p-2">
            <Button
              onClick={() => route.back()}
              variant="outlined"
              color="primary"
            >
              Back
            </Button>
          </Box>
          
        </Box>
        <Divider sx={{ mb: 2 }} />
        <ReusableTable columns={columns} data={submissions} />
      </Grid>
    </>
  );
}
