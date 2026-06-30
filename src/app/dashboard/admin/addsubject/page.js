"use client";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

const schema = Yup.object().shape({
  subjectname: Yup.string().required("Subject name is required").trim(),
  subjectcode: Yup.string().required("Code is required").trim(),
});

export default function AddSubject() {
const router = useRouter()

  const [subjects, setSubjects] = useLocalStorage("subjects", []);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      subjectname: "",
      subjectcode: "",
    },
  });

  const onSubmit = (data) => {
    try {
      const normalizedName = data.subjectname.trim().toLowerCase();
      const normalizedCode = data.subjectcode.trim().toLowerCase();

      const duplicateName = subjects.find(
        (subj) => subj.subjectname.trim().toLowerCase() === normalizedName,
      );

      if (duplicateName) {
        toastMessage("A subject with this name already exists", "error");
        return;
      }

      const duplicateCode = subjects.find(
        (subj) => subj.subjectcode.trim().toLowerCase() === normalizedCode,
      );

      if (duplicateCode) {
        toastMessage("This subject code is already in use", "error");
        return;
      }

      setSubjects((prev) => [
        {
          id: Date.now(),
          subjectname: data.subjectname.trim(),
          subjectcode: data.subjectcode.trim(),
        },
        ...prev,
      ]);

      toastMessage("Subject created successfully", "success");
      reset()
      router.push('/dashboard/admin')
    } catch (error) {
      console.error(error);
      toastMessage("Error in creating subject", "error");
    }
  };

  return (
    <Box className="flex items-center justify-center h-full bg-gray-50 px-4 py-10">
      <Paper
        elevation={3}
        className="w-full max-w-md rounded-3xl p-8 shadow-xl"
      >
        <Box className="text-center mb-6">
          <Typography
            variant="h4"
            className="font-bold tracking-wide text-gray-800"
          >
            Add Subject
          </Typography>

          <Typography variant="body2" className="text-gray-500 mt-2">
            Create a new subject
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            name="subjectname"
            placeholder="e.g. Chemistry"
            label="Subject Name"
            type="text"
            control={control}
          />

          <FormField
            name="subjectcode"
            placeholder="e.g. CHEM-101"
            label="Subject Code"
            type="text"
            control={control}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Create Subject
          </Button>
          <Button
                      className="rounded-xl py-3 font-semibold"
                      onClick={() => {
                        router.back();
                      }}
                    >
                      Cancel
                    </Button>
        </form>
      </Paper>
    </Box>
  );
}
