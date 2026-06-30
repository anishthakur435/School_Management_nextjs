"use client";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { Box, Button, Chip, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import useLocalStorage from "use-local-storage";

export default function FeesPage() {
  const router = useRouter();

  //
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [createdClass, setCreatedClass] = useLocalStorage("createdClass", []);
  const [classStudent, setClassStudent] = useLocalStorage("classStudent", []);
  const [feeRecords, setFeeRecords] = useLocalStorage("feeRecords", []);
  const [feeStructure, setFeeStructure] = useLocalStorage("feeStructure", []);

  const students = userData.filter(
    (user) => user.role?.toUpperCase() === "STUDENT",
  );

  ////
  const feeDataColumns = [
    {
      id: "receiptNo",
      label: "Receipt",
      render: (value) => (
        <Chip color="primary" label={value} variant="contained" size="small" />
      ),
    },
    { id: "studentName", label: "Student" },
    { id: "classname", label: "Class" },
    {
      id: "amount",
      label: "Amount",
      render: (value) => (
        <Chip label={value} variant="outlined" size="small" color="info" />
      ),
    },
    { id: "type", label: "Type" },
    {
      id: "paymentDate",
      label: "Date",
      render: (_, row) => {
        const paymentDate = new Date(row.paymentDate).toLocaleDateString();
        return <Typography>{paymentDate}</Typography>;
      },
    },
    {
      id: "status",
      label: "Status",
      render: (value) => {
        const isPaid = value?.toUpperCase() === "PAID";
        return (
          <Chip
            color={isPaid ? "success" : "warning"}
            label={value}
            variant="outlined"
            size="small"
          />
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg" className="mt-8 px-4 pb-12">
      <Box className="mb-8 flex justify-between items-center">
        <Box>
          <Typography
            variant="h4"
            className="font-bold tracking-wide text-gray-800"
          >
            Fee Management
          </Typography>
        </Box>

        <Box className="flex justify-end gap-4">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/dashboard/admin/fees/add")}
            className="bg-blue-600"
          >
            Collect Fee
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/dashboard/admin/fees/structure")}
          >
            Structure
          </Button>
        </Box>
      </Box>

      {/*  */}
      <Grid
        xs={12}
        className="border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto shadow-sm bg-white"
      >
        <Box className="justify-between flex flex-row bg-[#eff6ff]">
          <Typography variant="h6" className="font-semibold p-4 text-gray-800">
            Fee Transactions
          </Typography>
        </Box>
        <ReusableTable columns={feeDataColumns} data={feeRecords} />
      </Grid>
    </Container>
  );
}
