"use client";

import React from "react";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, Grid, MenuItem, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/reusable/ResuableSelect";

const schema = Yup.object().shape({
  class: Yup.string().required("Class is required"),
  subject: Yup.string().required("Subject is required"),
  student: Yup.string().required("Student is required"),
  exam: Yup.string().required("Exam title is required"),
  marks: Yup.number()
    .positive()
    .integer()
    .required("Marks are required")
    .typeError("Must be a valid number")
    .max(Yup.ref("maxmarks"), "Cannot exceed maximum marks"),
  maxmarks: Yup.number()
    .positive()
    .integer()
    .required("Max marks are required")
    .typeError("Must be a valid number")
    .min(20, "Cannot be lower than 20")
    .max(100, "Cannot be greater than 100"),
  gradeAwarded: Yup.string().required("Grade is required"),
  feedback: Yup.string().optional(),
});
export default function GradesRemarks() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData] = useLocalStorage("userData", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [grades, setGrades] = useLocalStorage("grades", []);

  const findTeacher = userData.find(
    (user) => String(user.id) == String(session?.user?.id),
  );

  const myAssignedClasses = assignedCourses.filter(
    (course) => course.teacher == findTeacher?.name,
  );


  const myAssignedCourses = assignedCourses.filter(
    (course) => course.teacher == findTeacher?.name,
  );

  const { control, handleSubmit, reset, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      class: "",
      subject: "",
      student: "",
      exam: "",
      marks: "",
      maxmarks: "",
      gradeAwarded: "",
      feedback: "",
    },
  });

  const selectedClass = watch("class");

  const uniqueClasses = Array.from(
    new Set(myAssignedCourses.map((c) => c.classname)),
  );

  const subjectsForClass = myAssignedCourses.filter(
    (course) => course.classname == selectedClass,
  );

  const studentsForClass = classStudent.filter(
    (student) => student.classname == selectedClass,
  );

  const submitGrades = (data) => {
    try {
      const percentage = ((data.marks / data.maxmarks) * 100).toFixed(2);

      const newGradeEntry = {
        id: Date.now().toString(),
        teacherName: findTeacher?.name,
        percentage,
        subjectname: data.subject,
        student: data.student,
        remarks: data.feedback,
        ...data,
      };

      setGrades([newGradeEntry, ...grades]);
      toastMessage("Grade recorded successfully", "success");
      router.replace("/dashboard/teacher/grading");
      reset();
    } catch (error) {
      console.error("Error recording grade:", error);
      toastMessage("Failed to record grade", "error");
    }
  };
  return (
    <>
      <div className=" justify-center items-start p-6 w-full">
        <div className="text-center mb-2">
          <Typography variant="h5" className="font-bold text-gray-800">
            Submit Student Grade
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit(submitGrades)}
          className="flex flex-col gap-2"
        >
          <FormSelect
            name="class"
            label="Select Class"
            control={control}
            options={uniqueClasses.map((classname) => ({
              value: classname,
              label: classname,
            }))}
          />
          {/* <FormField name="class" label="Select Class" control={control} select>
            {uniqueClasses.map((classname) => (
              <MenuItem key={classname} value={classname}>
                {classname}
              </MenuItem>
            ))}
          </FormField> */}

          <FormSelect
            name="subject"
            label="Select Subject"
            control={control}
            disabled={!selectedClass}
            options={subjectsForClass.map((course) => ({
              label: course.subjectname,
              value: course.subjectname,
            }))}
          />

          {/* <FormField
            name="subject"
            label="Select Subject"
            control={control}
            select
            disabled={!selectedClass}
          >
            {subjectsForClass.map((course) => (
              <MenuItem
                key={course.id || course.subjectname}
                value={course.subjectname}
              >
                {course.subjectname}
              </MenuItem>
            ))}
          </FormField> */}

          <FormSelect
            name="student"
            label="Select Student"
            control={control}
            options={studentsForClass.map((student) => ({
              label: student.student,
              value: student.student,
            }))}
          />
          {/* <FormField
            name="student"
            label="Select Student"
            control={control}
            select
            disabled={!selectedClass}
          >
            {studentsForClass.map((student) => (
              <MenuItem
                key={student.id || student.student}
                value={student.student}
              >
                {student.student}
              </MenuItem>
            ))}
          </FormField> */}

          <FormField
            name="exam"
            label="Exam Title"
            placeholder="Midterm 1"
            type="text"
            control={control}
          />

          <Grid container spacing={2}>
            <Grid size={6}>
              <FormField
                name="maxmarks"
                label="Max Marks"
                placeholder="100"
                type="number"
                control={control}
                fullWidth
              />
            </Grid>
            <Grid size={6}>
              <FormField
                name="marks"
                label="Marks Scored"
                type="number"
                control={control}
                fullWidth
              />
            </Grid>
          </Grid>

          <FormSelect
            name="gradeAwarded"
            label="Grade"
            control={control}
            options={[
              { label: "A+", value: "A+" },
              { label: "A", value: "A" },
              { label: "B+", value: "B+" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
              { label: "E", value: "E" },
              { label: "F", value: "F" },
            ]}
          />
          {/* <FormField name="gradeAwarded" label="Grade" control={control} select>
            {["A+", "A", "B+", "B", "C", "D", , "E", "F"].map((grade) => (
              <MenuItem key={grade} value={grade}>
                {grade}
              </MenuItem>
            ))}
          </FormField> */}

          <FormField
            name="feedback"
            label="Feedback (optional)"
            type="text"
            multiline
            rows={2}
            control={control}
          />

          <Box className="text-sm text-gray-500 mb-2">
            Note: Once submitted, attendance cannot be edited. Please review
            before submitting.
          </Box>
          <Box className="flex gap-4">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              disabled={!selectedClass}
              className="rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              fullWidth
            >
              Submit Grade
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
      </div>
    </>
  );
}
