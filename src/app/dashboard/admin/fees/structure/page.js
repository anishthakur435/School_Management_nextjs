"use client";
import FormSelect from "@/components/reusable/ResuableSelect";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "use-local-storage";
import * as Yup from "yup";

// Form  schema
const schema = Yup.object().shape({
  classname: Yup.string().required("Class  is required"),
  annual: Yup.number()
    .typeError("Must be a number")
    .required("Annual fee is required")
    .min(0, "Cannot be negative"),
});

export default function FeeStructurePage() {
  const router = useRouter();

  const [createdClass] = useLocalStorage("createdClass", []);
  const [feeStructure, setFeeStructure] = useLocalStorage("feeStructure", []);

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      classname: "",
      annual: "",
    },
  });

  //   /////
  const onSubmit = (data) => {
    try {
      const exists = feeStructure.find(
        (fee) => fee.classname === data.classname,
      );
      if (exists) {
        return toastMessage(
          "Fee structure for this class already exists",
          "error",
        );
      }
      const annualFee = Number(data.annual);
      const newFeeStructure = {
        id: Date.now(),
        classname: data.classname,
        annual: annualFee,
        halfyearly: Number((annualFee / 2).toFixed(2)),
        monthly: Number((annualFee / 12).toFixed(2)),
      };


      setFeeStructure([newFeeStructure, ...feeStructure]);
      toastMessage("Fee structure added successfully!", "success");
      reset();
      router.push("/dashboard/admin/fees");
    } catch (error) {

      toastMessage("Failed to add fee structure", "error");
    }
  };

  //   ///
  const feeColumnStructure = [
    { id: "classname", label: "Class" },
    { id: "annual", label: "Annual Fee" },
    { id: "halfyearly", label: "Half-Yearly Fee" },
    {
      id: "monthly",
      label: "Monthly Fee",
      render: (value) => (
        <Chip color="primary" label={value} variant="outlined" size="small" />
      ),
    },
  ];

  return (
    
    <Container maxWidth="xl" className="mt-8 px-4 pb-12">
      <Box className="mb-8 p-6 border-2 border-[#eff6ff]/90 rounded-2xl bg-white shadow-sm">
        <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
          Create Fee Structure
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormSelect
            name="classname"
            label="Select Class"
            control={control}
            options={createdClass.map((cls) => ({
              value: cls.classname,
              label: cls.classname,
            }))}
          />
          {/* <FormField
            name="classname"
            label="Select Class"
            select
            control={control}
            fullWidth
          >
            <MenuItem value="" disabled>
              Select a Class
            </MenuItem>
            {createdClass?.length > 0 ? (
              createdClass.map((cls) => (
                <MenuItem key={cls.id} value={cls.classname}>
                  {cls.classname}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="none" disabled>
                No classes available
              </MenuItem>
            )}
          </FormField> */}

          <FormField
            name="annual"
            label="Annual Fee Amount"
            type="number"
            control={control}
            fullWidth
          />

          <Box className="flex gap-3 mt-2">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="rounded-xl py-2 px-6 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Save
            </Button>
            <Button
              className="rounded-xl py-2 px-6 font-semibold"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>

      {/* //// */}
      <Grid
        xs={12}
        className="border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto shadow-sm bg-white"
      >
        <Box className="justify-between flex flex-row bg-[#eff6ff]">
          <Typography variant="h6" className="font-semibold p-4 text-gray-800">
            Fee Structure
          </Typography>
        </Box>
        <ReusableTable data={feeStructure} columns={feeColumnStructure} />
      </Grid>
    </Container>
  );
}
