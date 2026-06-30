"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Chip,
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";

const schema = Yup.object().shape({
  answer: Yup.string()
    .required("Please provide your answer or a link to your work.")
    .trim(),
});

export default function StudentAssignmentSubmit() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  // 2. Initialize Local Storage
  const [userData] = useLocalStorage("userData", []);
  const [assignments] = useLocalStorage("assignments", []);
  const [submitAssignment, setSubmitAssignment] = useLocalStorage(
    "submittedAssignment",
    [],
  );

  const findStudent = userData?.find(
    (user) => String(user.id) === String(session?.user?.id),
  );

  const currentAssignment = assignments?.find(
    (assignment) => String(assignment.id) === String(id),
  );

  const hasSubmitted = submitAssignment?.find(
    (sub) =>
      String(sub.assignmentId) === String(id) &&
      String(sub.studentId) === String(findStudent?.id),
  );
  const isExpired =
    new Date(currentAssignment.dueDate) <
    new Date(new Date().setHours(0, 0, 0, 0));

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      answer: "",
    },
  });

  const onSubmit = (data) => {
    try {
      if (!findStudent) {
        return toastMessage("Student profile not found!", "error");
      }

      if (hasSubmitted) {
        return toastMessage(
          "You have already submitted this assignment.",
          "error",
        );
      }

      const newSubmitAssignment = {
        id: Date.now(),
        assignmentId: currentAssignment.id,
        assignmentTitle: currentAssignment.title,
        studentId: findStudent.id,
        studentName: findStudent.name,
        classname: findStudent.classname,
        teacherId: currentAssignment.teacherId,
        subjectname: currentAssignment.subjectname,
        answer: data.answer,
        submittedAt: new Date().toISOString(),
      };

      console.log("newSubmitAssignment,", newSubmitAssignment);

      setSubmitAssignment([newSubmitAssignment, ...(submitAssignment || [])]);
      toastMessage("Assignment submitted successfully!", "success");
      reset();

      router.push("/dashboard/student/assignment");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to submit assignment", "error");
    }
  };

  if (!currentAssignment) {
    return (
      <Container className="mt-8 text-center">
        <Typography variant="h6" color="error">
          Assignment not found.
        </Typography>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="mt-8 px-4 pb-12 ">
      <Box className="p-6 rounded-2xl border-2 border-[#eff6ff]/90 ">
        <Box className="justify-between flex flex-row ">
          <Typography
            variant="h5"
            className="font-bold text-gray-800 mb-2 text-center"
          >
            Assignment Details
          </Typography>
          <Typography>{new Date().toLocaleDateString()}</Typography>
        </Box>
        <Divider />

        <Box className=" p-5">
          <Typography variant="h6" className="font-bold text-gray-800 mb-2 ">
            {currentAssignment.title}
          </Typography>
          <Box className="flex gap-2 mb-4 ">
            <Chip
              label={currentAssignment.subjectname}
              color="primary"
              variant="outlined"
            />
            <Chip label={`Teacher: ${currentAssignment.teacherName}`} />
            <Chip
              label={`Due: ${new Date(currentAssignment.dueDate).toLocaleDateString()}`}
              color="error"
              variant="outlined"
            />
          </Box>

          <Box className="flex flex-row items-center gap-4">
            <Typography variant="caption" className="font-semibold ">
              Instructions:
            </Typography>
            <Typography variant="subtitle1">
              {currentAssignment.description}
            </Typography>
          </Box>
        </Box>

        <Box className="p-4 rounded-xl ">
          <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
            Answer
          </Typography>

          {hasSubmitted ? (
            <Box className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <Typography className="text-green-700 font-semibold text-lg">
                You have already submitted this assignment.
              </Typography>
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                name="answer"
                label="Your Answer"
                type="textarea"
                control={control}
                multiline
                placeholder="Type your answer "
                fullWidth
                rows={6}
              />

              <Box className="flex gap-4 mt-2">
                <Button variant="contained" type="submit" disabled={isExpired}>
                  Submit
                </Button>
                {isExpired && (
                  <Typography color="error">
                    Assignment deadline passed.
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={() =>
                    router.replace("/dashboard/student/assignment")
                  }
                >
                  Cancel
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Box>
    </Container>
  );
}
