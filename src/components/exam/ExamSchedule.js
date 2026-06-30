"use client";
import { Box, Button, MenuItem, Paper, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import FormField from "../reusable/reusableForm";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastMessage } from "../reusable/reusableToast";
import { useRouter } from "next/navigation";
import FormSelect from "../reusable/ResuableSelect";

// /////
const schema = Yup.object().shape({
  classname: Yup.string().required("Class is required"),
  subjectname: Yup.string().required("Subject is required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test(
      "is-greater",
      "End time must be later than start time",
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return value > startTime;
      },
    ),
});

export default function ExamSchedule() {
  const router = useRouter();

  const [userData, setUserData] = useLocalStorage("userData", []);
  const [subject, setSubject] = useLocalStorage("subjects", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [examSchedule, setExamSchedule] = useLocalStorage("examSchedule", []);
  const [assignedCourses, setAssignedCourses] = useLocalStorage(
    "assignedCourses",
    [],
  );
  const uniqueClass = Array.from(
    new Set(classStudent.map((classDetails) => classDetails.classname)),
  );
  // console.log("uniqueClass", uniqueClass);
  //
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      classname: "",
      subjectname: "",
      date: "",
      startTime: "",
      endTime: "",
    },
  });

  const selectedClassname = watch("classname");
  // console.log("selectedClassname", selectedClassname);

  const findSubjectInClass = assignedCourses.filter(
    (subject) => subject.classname === selectedClassname,
  );
  // console.log("findSubjectInClass", findSubjectInClass);
  //

  const createExamSchedule = (examScheduleDetails) => {
    // console.log("examSchedule", examScheduleDetails);
    const duplicateSchedule = examSchedule.some(
      (schedule) =>
        schedule.classname === examScheduleDetails.classname &&
        schedule.subjectname === examScheduleDetails.subjectname,
    );
    // console.log("duplicateSchedule", duplicateSchedule);
    if (duplicateSchedule) {
      toastMessage(
        "An exam schedule for this class and subject already exists",
        "error",
      );
      return;
    }

    const duplicateExam = examSchedule.some(
      (schedule) =>
        schedule.classname === examScheduleDetails.classname &&
        schedule.date === examScheduleDetails.date,
    );

    if (duplicateExam) {
      toastMessage(
        "Already  an exam is scheduled on this date for this class",
        "error",
      );
      return;
    }
    const newSchedule = {
      id: Date.now(),
      ...examScheduleDetails,
    };
    // console.log("newSchedule", newSchedule);

    setExamSchedule([newSchedule, ...examSchedule]);
    toastMessage("exam schedule created ", "success");
    reset();
    router.push("/dashboard/exam");
  };

  return (
    <>
      <Box className="flex items-center justify-center h-full bg-gray-50 px-4 py-10">
        <Box className="w-full max-w-md rounded-3xl p-8 shadow-xl">
          <Box className="text-center mb-6">
            <Typography
              variant="h4"
              className="font-bold tracking-wide text-gray-800"
            >
              Create schedule
            </Typography>
          </Box>

          <form
            onSubmit={handleSubmit(createExamSchedule)}
            className="flex flex-col gap-5"
          >
            <FormSelect
              name="classname"
              label="Class"
              control={control}
              options={uniqueClass.map((existingClass) => ({
                label: existingClass,
                value: existingClass,
              }))}
            />
            {/* <FormField
              name="classname"
              label="Class"
              control={control}
              defaultValues=""
              fullWidth
              select
            >
              <MenuItem value="" disabled>
                Select a Class
              </MenuItem>
              {uniqueClass.map((existingClass) => (
                <MenuItem key={existingClass} value={existingClass}>
                  {existingClass}
                </MenuItem>
              ))}
            </FormField> */}

            <FormSelect
              name="subjectname"
              label="Subject"
              control={control}
              options={findSubjectInClass.map((subjects) => ({
                value: subjects.subjectname,
                label: subjects.subjectname,
              }))}
            />

            
            {/* <FormField
              name="subjectname"
              label="Subject"
              defaultValues=""
              control={control}
              fullWidth
              select
            >
              <MenuItem value="" disabled>
                Select a Subject
              </MenuItem>
              {findSubjectInClass.map((subjects) => (
                <MenuItem key={subjects.id} value={subjects.subjectname}>
                  {subjects.subjectname}
                </MenuItem>
              ))}
            </FormField> */}

            <FormField name="date" type="date" control={control} />
            <Box className="flex  justify-around gap-4 w-full">
              <Box>
                <Typography>Start Time</Typography>
                <FormField
                  name="startTime"
                  type="time"
                  control={control}
                  fullWidth
                />
              </Box>
              <Box>
                <Typography>End Time</Typography>
                <FormField
                  name="endTime"
                  type="time"
                  control={control}
                  fullWidth
                />
              </Box>
            </Box>
            <Button type="submit">add</Button>
          </form>
        </Box>
      </Box>
    </>
  );
}
