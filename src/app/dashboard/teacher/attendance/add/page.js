"use client";

import React, { useState } from "react";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";

import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/reusable/ResuableSelect";

const schema = Yup.object().shape({
  classname: Yup.string().required("Class is required"),
  date: Yup.string().required("Date is required"),
});

export default function AddAttendanceRemarks() {
  const { data: session } = useSession();
  const router = useRouter();

  const [userData] = useLocalStorage("userData", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [attendance, setAttendance] = useLocalStorage("attendance", []);
  const findTeacher = userData.find(
    (user) => String(user.id) === String(session?.user?.id),
  );

  const myStudents = classStudent.filter(
    (student) => String(student.teacher) === String(findTeacher?.name),
  );

  const uniqueClasses = Array.from(
    new Set(myStudents.map((student) => student.classname)),
  );

  const { control, handleSubmit, watch, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { classname: "", date: "" },
  });

  const selectedClass = watch("classname");

  const studentsInSelectedClass = myStudents.filter(
    (student) => student.classname === selectedClass,
  );

  const onSubmit = (data) => {
    try {
      const isAlreadyMarked = attendance.some(
        (r) => r.classname === data.classname && r.date === data.date,
      );

      if (isAlreadyMarked) {
        toastMessage("Attendance already marked for this date", "error");
        return;
      }

      const studentRecords = studentsInSelectedClass.map((student) => ({
        studentName: student.student,
        status: data[`status_${student.student}`] || "Absent", // Default to Absent if not selected
      }));

      const presentStudents = studentRecords
        .filter(
          (student) =>
            student.status === "Present" || student.status === "Late",
        )
        .map((student) => student.studentName);

      const newAttendanceRecord = {
        id: Date.now().toString(),
        teacherName: findTeacher?.name,
        classname: data.classname,
        date: data.date,
        totalStudents: studentRecords.length,
        presentCount: presentStudents.length,
        presentStudents,
        records: studentRecords,
      };

      setAttendance([newAttendanceRecord, ...attendance]);
      toastMessage("Attendance submitted successfully!", "success");
      reset({ classname: "", date: "" });
      router.push("/dashboard/teacher/attendance");
    } catch (error) {
      toastMessage("Failed to submit attendance", "error");
      console.error(error);
    }
  };

  return (
    <>
      <Card elevation={4} className="p-4 h-full">
        <CardContent className="p-6 md:p-8">
          <Box className="flex items-center justify-between mb-6">
            <Typography
              variant="h5"
              className="font-bold text-gray-800 tracking-tight"
            >
              Daily Attendance
            </Typography>
          </Box>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormSelect
              name="classname"
              label="Choose Class"
              control={control}
              options={uniqueClasses.map((classname) => ({
                value: classname,
                label: classname,
              }))}
            />
            {/* <FormField
              name="classname"
              label="Choose Class"
              control={control}
              select
            >
              {uniqueClasses.map((className) => (
                <MenuItem key={className} value={className}>
                  {className}
                </MenuItem>
              ))}
            </FormField> */}
            <FormField name="date" type="date" control={control} />
            {/*  */}

            {/* Student */}
            {selectedClass && studentsInSelectedClass?.length > 0 && (
              <Box className="mt-2">
                <Box className="flex items-center justify-between mb-4">
                  <Typography
                    variant="subtitle1"
                    className="font-bold text-gray-800"
                  >
                    Student in Class
                  </Typography>

                  <Chip
                    label={`${studentsInSelectedClass?.length}`}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Box className=" overflow-y-auto pr-1 flex flex-col gap-3">
                  {studentsInSelectedClass?.map((student) => (
                    <Box
                      key={student.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Box className="flex items-center gap-4">
                        <Typography className="font-semibold text-gray-800">
                          {student.student}
                        </Typography>

                        <Typography className="text-sm text-gray-500">
                          Roll No: {student.rollno}
                        </Typography>
                      </Box>

                      <Box className="w-40">
                        <FormSelect
                          name={`status_${student.student}`}
                          label="Status"
                          control={control}
                          options={[
                            { label: "Present", value: "Present" },
                            { label: "Absent", value: "Absent" },
                            { label: "Late", value: "Late" },
                          ]}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Empty State */}
            {selectedClass && studentsInSelectedClass.length === 0 && (
              <Box className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
                <Typography className="text-amber-700 font-medium">
                  No active students assigned to this class
                </Typography>
              </Box>
            )}

            {/* Submit */}
            <Box className="text-sm text-gray-500 mb-2">
              Note: Once submitted, attendance cannot be edited. Please review
              before submitting.
            </Box>

            <Box className="flex items-center gap-4 justify-center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                fullWidth
                disabled={
                  !selectedClass || studentsInSelectedClass.length === 0
                }
              >
                Submit Attendance
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                className="rounded-xl py-3 font-semibold"
                onClick={() => {
                  router.replace("/dashboard/teacher");
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
