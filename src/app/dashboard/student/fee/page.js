"use client";
import { Box, Typography, Chip, Button, Divider } from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useRouter } from "next/navigation";

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
    default:
      end.setMonth(end.getMonth() + 1);
  }
  return { start, end };
};

export default function FeesCardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useLocalStorage("userData", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [feeRecords, setFeeRecords] = useLocalStorage("feeRecords", []);
  const [feeStructure] = useLocalStorage("feeStructure", []);

  const studentName = session?.user?.name || "Student";
  const studentEmail = session?.user?.email;

  //
  const studentDetails = userData.find(
    (user) => String(user.id) === String(session?.user?.id),
  );

  const feeStatus = studentDetails?.feeStatus || "Pending";
  const feeType = studentDetails?.feeType || "Monthly";
  const isFeePending = studentDetails?.feeStatus?.toUpperCase() === "PENDING";
  const myEnrollment = classStudent?.find(
    (cs) => cs.student === studentName || cs.studentEmail === studentEmail,
  );
  const myClassName = myEnrollment?.classname || "Not Assigned";

  const structure = feeStructure?.find(
    (fs) => String(fs.classname) === String(myClassName),
  );
  let amountToPay = studentDetails?.feeAmount || 0;
  if (structure) {
    if (feeType === "Monthly") amountToPay = structure.monthly;
    else if (feeType === "Half-Yearly") amountToPay = structure.halfyearly;
    else if (feeType === "Annual") amountToPay = structure.annual;
  }
  const currentDate = new Date();
  const currentMonthDisplay = currentDate.toLocaleString("default", {
    month: "long",
    year:"numeric"
  });
  const { start, end } = getBillingCycle(currentDate, feeType);
  const startMonth = start.toLocaleString("default", { month: "long" });
  const startYear = start.getFullYear();
  const dueDateMonth = end.toLocaleString("default", { month: "long" });
  const dueDateYear = end.getFullYear();

  const handlePayFee = () => {
    if (!studentDetails?.feeType) {
      toastMessage("Student details not found", "error");
      return;
    }
    try {
      const currentDate = new Date();
      const paymentMonth = currentDate.toLocaleString("en-IN", {
        month: "long",
      });
      const paymentYear = currentDate.getFullYear();
      const feeType = studentDetails.feeType;

      const isDuplicateFee = feeRecords.some((record) => {
        if (String(record.studentId) !== String(studentDetails.id)) {
          return false;
        }
        const recordStart = new Date(record.paymentStartDate);
        const recordEnd = new Date(record.paymentEndDate);

        return currentDate >= recordStart && currentDate < recordEnd;
      });

      if (isDuplicateFee) {
        toastMessage("Fee already paid for this  month", "error");
        return;
      }

    //   const { start, end } = getBillingCycle(currentDate, feeType);
    //   const dueDateMonth = end.toLocaleString("default", { month: "long" });
    //   const dueDateYear = end.getFullYear();
      const getFullDueDate = `${dueDateMonth} ${dueDateYear}`;
      const generatedReceiptNo = `REC-${Date.now().toString().slice(-6)}`;
      const feeId = Date.now();
      const updatedUserData = userData.map((user) => {
        if (String(user.id) === String(studentDetails.id)) {
          return {
            ...user,
            feeReceiptNo: generatedReceiptNo,
            feeAmount: Number(amountToPay),
            feeDate: currentDate,
            feeDueDate: getFullDueDate,
            feeStatus: "Paid",
          };
        }
        return user;
      });
      const newFeeRecord = {
        id: feeId,
        receiptNo: generatedReceiptNo,
        studentId: studentDetails.id,
        studentName: studentName,
        studentEmail: studentEmail,
        classname: myClassName,
        type: feeType,
        amount: Number(amountToPay),
        paymentDate: currentDate,
        paymentMonth,
        paymentYear,
        paymentStartDate: start.toISOString(),
        paymentEndDate: end.toISOString(),
        dueDate: getFullDueDate,
        status: "Paid",
      };

      // console.log("updatedUserData", updatedUserData);
      // console.log("newFeeRecord", newFeeRecord);

      //   setUserData(updatedUserData);
      //   setFeeRecords([newFeeRecord, ...feeRecords]);

      toastMessage("Fee paid successfully", "success");
      //   router.replace("/dashboard/student");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to process payment.", "error");
    }
  };

  return (
    <>
      <Box className="max-w-3xl mx-auto bg-white rounded-xl  border border-gray-100 overflow-hidden">
        <Box className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fafafa]">
          <Box>
            <Typography
              variant="h5"
              className="font-extrabold text-gray-900 flex items-center gap-2"
            >
              Fee Payment
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Billing Cycle: {startMonth} {startYear} -{dueDateMonth} {dueDateYear}
            </Typography>
          </Box>
          <Chip
            label={feeStatus.toUpperCase()}
            color={isFeePending ? "warning" : "success"}
            variant={isFeePending ? "filled" : "outlined"}
            className="font-bold tracking-wider"
            size="medium"
          />
        </Box>

        <Box className="p-8 border-b border-gray-100 grid md:grid-cols-2 gap-8 bg-white">
          <Box>
            <Typography
              variant="overline"
              className="text-gray-400 font-bold  block mb-2"
            >
              Payment By
            </Typography>
            <Typography variant="h6" className="font-bold text-gray-800">
              {studentName}
            </Typography>
            <Box className="text-gray-600 mt-1 space-y-1 text-sm">
              <p>
                Class:
                <span className="font-medium text-gray-900">{myClassName}</span>
              </p>
              <p>
                Roll Number:
                <span className="font-medium text-gray-900">
                  {studentDetails?.rollno}
                </span>
              </p>
              <p>
                Parent:
                <span className="font-medium text-gray-900">
                  {studentDetails?.parentName}
                </span>
              </p>
            </Box>
          </Box>

          <Box className="md:text-right">
            <Typography
              variant="overline"
              className="text-gray-400 font-bold  block mb-2"
            >
              Payment Details
            </Typography>
            <Box className="text-gray-600 mt-1 space-y-1 text-sm">
              <p>
                Fee Type:
                <span className="font-medium text-gray-900">{feeType}</span>
              </p>
              <p>
                Payment Date:
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </p>
            </Box>
          </Box>
        </Box>

        <Box className="p-8 bg-white">
          <Typography
            variant="overline"
            className="text-gray-400 font-bold  block mb-4"
          >
            Description
          </Typography>

          <Box className="flex justify-between items-center py-4 border-b  border-gray-200">
            <Typography className="text-gray-800 font-medium">
              Tuition Fee ({currentMonthDisplay})
            </Typography>
            <Typography className="text-gray-800">₹{amountToPay}</Typography>
          </Box>

          <Box className="flex flex-col items-end mt-6 space-y-3">
            <Box className="flex justify-between w-full max-w-xs items-center px-2">
              <Typography className="text-gray-600 font-bold">
                Total Due
              </Typography>
              <Typography variant="h5" className="font-black text-blue-600">
                ₹{amountToPay}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col md:flex-row justify-end items-center gap-4">
          <Box className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              className="text-gray-600 border-gray-300 w-full md:w-auto hover:bg-gray-100"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!isFeePending}
              onClick={handlePayFee}
              className="w-full md:w-auto px-10 shadow-md"
              sx={{ fontWeight: "bold" }}
            >
              Pay ₹{amountToPay}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
