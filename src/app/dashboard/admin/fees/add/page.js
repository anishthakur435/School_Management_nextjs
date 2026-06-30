"use client";

import FormSelect from "@/components/reusable/ResuableSelect";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, MenuItem, Typography, Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { lazy, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

/////
const schema = Yup.object().shape({
  studentId: Yup.string().required("Please select a student"),
  classname: Yup.string().required("Class name is required").trim(),
  type: Yup.string().required("Payment type is required"),
  amount: Yup.number()
    .positive("Amount must be a positive number")
    .required("Amount is required")
    .typeError("Amount must be a number"),
  date: Yup.date()
    .required("Payment date is required")
    .typeError("Please enter a valid date"),
  status: Yup.string()
    .oneOf(["Paid", "Pending"])
    .required("Payment status is required"),
});

// /////

const getBillingCycle = (date, type) => {
  const paymentDate = new Date(date);

  const start = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);

  const end = new Date(start);

  switch (type) {
    case "Monthly":
      end.setMonth(end.getMonth() + 1);
      break;

    case "Half-Yearly":
      end.setMonth(end.getMonth() + 6);
      break;

    case "Annual":
      end.setFullYear(end.getFullYear() + 1);
      break;
  }

  return { start, end };
};

export default function AddFeePage() {
  const router = useRouter();
  const dateRef = useRef(null);

  const [userData, setUserData] = useLocalStorage("userData", []);
  const [feeRecords, setFeeRecords] = useLocalStorage("feeRecords", []);
  const [feeStructure] = useLocalStorage("feeStructure", []);

  const students = userData.filter(
    (user) => user.role?.toUpperCase() === "STUDENT",
  );

  ////
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      studentId: "",
      classname: "",
      type: "",
      amount: "",
      date: "",
      status: "Paid",
    },
  });
  const findStudentId = watch("studentId");
  const findClassFee = watch("classname");
  const findPaymentType = watch("type");

  useEffect(() => {
    if (findStudentId) {
      const student = students.find(
        (s) => String(s.id) === String(findStudentId),
      );
      if (student) {
        setValue("classname", student.classname || "");
        setValue("type", student.feeType || "");
      }
    } else {
      setValue("classname", "");
      setValue("type", "");
    }
  }, [findStudentId, students, setValue]);

  useEffect(() => {
    if (findClassFee && findPaymentType) {
      const structure = feeStructure.find(
        (s) => String(s.classname) === String(findClassFee),
      );

      if (structure) {
        if (findPaymentType === "Monthly")
          setValue("amount", structure.monthly);
        else if (findPaymentType === "Half-Yearly")
          setValue("amount", structure.halfyearly);
        else if (findPaymentType === "Annual")
          setValue("amount", structure.annual);
      } else {
        setValue("amount", 0);
      }
    }
  }, [findClassFee, findPaymentType, feeStructure, setValue]);

  useEffect(() => {
    if (!userData?.length) return;
    const today = new Date();
    const updatedUsers = userData.map((user) => {
      if (!user.feeDueDate) return user;
      const dueDate = new Date(user.feeDueDate);
      if (user.feeStatus?.toUpperCase() === "PAID" && today >= dueDate) {
        return {
          ...user,
          feeStatus: "Pending",
        };
      }
      return user;
    });
    setUserData(updatedUsers);
  }, []);

  //
  const addFeeRecord = (data) => {
    try {
      const studentDetails = students.find(
        (s) => String(s.id) === String(data.studentId),
      );

      if (!studentDetails) {
        return toastMessage("Student not selected", "error");
      }

      const paymentDateObj = new Date(data.date);
      const paymentMonth = paymentDateObj.toLocaleString("en-IN", {
        month: "long",
      });
      const paymentYear = paymentDateObj.getFullYear();
      // console.log("paymentDateObj", paymentDateObj);

      //
      const isDuplicateFee = feeRecords.some((record) => {
        if (String(record.studentId) !== String(data.studentId)) {
          return false;
        }
        const recordStart = new Date(record.paymentStartDate);
        const recordEnd = new Date(record.paymentEndDate);
        return paymentDateObj >= recordStart && paymentDateObj < recordEnd;
      });

      if (isDuplicateFee) {
        return toastMessage(`${data.status} for this month`, "error");
      }

      if (
        studentDetails.feeType &&
        studentDetails.feeType.toUpperCase() !== data.type.toUpperCase()
      ) {
        return toastMessage(
          `Payment type must match student type (${studentDetails.feeType}).`,
          "error",
        );
      }

      const generatedReceiptNo = `REC-${Date.now().toString().slice(-6)}`;
      const feeId = Date.now();
      const paymentDate = data.date;
      const { start, end } = getBillingCycle(data.date, data.type);
      const dueDateMonth = end.toLocaleString("default", { month: "long" });
      const dueDateYear = end.getFullYear();

      const getFullDueDate = `${dueDateMonth} ${dueDateYear}`;
      const newUserDetails = userData.map((user) => {
        if (String(user.id) === String(data.studentId)) {
          return {
            ...user,
            feeReceiptNo: generatedReceiptNo,
            feeType: studentDetails.feeType,
            feeAmount: Number(data.amount),
            feeDate: paymentDate,
            feeDueDate: getFullDueDate,
            feeStatus: data.status,
          };
        }
        return user;
      });

      const newFeeRecord = {
        id: feeId,
        receiptNo: generatedReceiptNo,
        studentId: studentDetails.id,
        studentName: studentDetails.name,
        studentEmail: studentDetails.email,
        classname: studentDetails.classname,
        type: data.type,
        amount: Number(data.amount),
        paymentDate,
        paymentMonth,
        paymentYear,
        paymentStartDate: start.toISOString(),
        paymentEndDate: end.toISOString(),
        dueDate: getFullDueDate,
        status: data.status,
      };
      // console.log("newFeeRecord", newFeeRecord);
      // console.log("newUserDetails", newUserDetails);

      setUserData(newUserDetails);
      setFeeRecords([newFeeRecord, ...feeRecords]);
      toastMessage("Fee added successfully!", "success");
      // reset();
      // router.replace("/dashboard/admin/fees");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to add fee", "error");
    }
  };

  // open date picker on click anywhere
  const handleDateOpen = () => {
    if (dateRef.current && typeof dateRef.current.showPicker === "function") {
      dateRef.current.showPicker();
    }
  };

  return (
    <Container maxWidth="sm" className="mt-8 px-4 pb-12">
      <Box className="mb-6 pb-4">
        <Typography
          variant="h4"
          className="font-bold tracking-wide text-gray-800 text-center"
        >
          Fee Payment
        </Typography>
      </Box>

      <form
        onSubmit={handleSubmit(addFeeRecord)}
        className="flex flex-col gap-6"
      >
        <FormSelect
          name="studentId"
          control={control}
          label="Select Student"
          options={students?.map((student) => ({
            value: String(student.id),
            label: `${student.name} (${student.email})`,
          }))}
        />
        {/* <FormField
          name="studentId"
          label="Select Student"
          select
          control={control}
          fullWidth
        >
          {students?.length > 0 ? (
            students.map((student) => (
              <MenuItem key={student.id} value={String(student.id)}>
                {student.name} ({student.email})
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No students available
            </MenuItem>
          )}
        </FormField> */}

        <FormField
          name="classname"
          label="Class"
          type="text"
          disabled
          control={control}
          fullWidth
        />
        <FormField
          name="type"
          label="Payment Type"
          disabled
          control={control}
          fullWidth
        />
        <FormField
          name="amount"
          label="Amount"
          type="number"
          disabled
          control={control}
          fullWidth
        />

        <Box onClick={handleDateOpen}>
          <Typography variant="caption" className="text-gray-600 block mb-1">
            Payment Date
          </Typography>
          <FormField
            onClick={handleDateOpen}
            name="date"
            type="date"
            control={control}
            fullWidth
            inputRef={dateRef}
          />
        </Box>

        <FormSelect
          name="status"
          label="Payment Status"
          control={control}
          options={[
            { label: "Paid", value: "Paid" },
            { label: "Pending", value: "Pending" },
          ]}
        />
        {/* <FormField
          name="status"
          label="Payment Status"
          select
          control={control}
          fullWidth
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </FormField> */}

        <Box className="flex flex-col md:flex-row gap-4 mt-4">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className="bg-blue-600 flex-1 py-3 text-lg"
          >
            Save Fee Record
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            className="flex-1 py-3 text-lg rounded-xl font-semibold border-gray-300 text-gray-700"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
}
