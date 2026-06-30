"use client";
import React, { useEffect, useRef, useState } from "react";
import "./reportCard.css";
import { Box, Button, CircularProgress } from "@mui/material";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import { toastMessage } from "@/components/reusable/reusableToast";

export default function StudentReportCard() {
  const { id } = useParams();
  const [userData] = useLocalStorage("userData", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [grades] = useLocalStorage("grades", []);
  const targetStudent = userData.find((user) => String(user.id) === String(id));
  const studentName = targetStudent.name;
  const studentEmail = targetStudent.email;

  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef,
  });

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
      await pdf.html(contentRef.current, {
        html2canvas: {
          scale: 0.8,
          useCORS: true,
        },
        callback: function (doc) {
          doc.save(`${studentName.replace(/\s+/g, "_")}_Report_Card.pdf`);
        },
      });
    } catch (error) {
      toastMessage("PDF generation failed:", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  //
  const myEnrollment = classStudent?.find(
    (cs) => cs.student === studentName || cs.studentEmail === studentEmail,
  );

  const myClassName = myEnrollment?.classname || "Not Assigned";
  const myRollNo = myEnrollment?.rollno || "N/A";

  //
  const myGrades =
    grades?.filter(
      (g) => g.student === studentName || g.studentEmail === studentEmail,
    ) || [];

  let totalScore = 0;
  let isNumeric = true;

  myGrades.forEach((g) => {
    const scoreVal = parseFloat(g.marks || g.grade);
    if (isNaN(scoreVal)) {
      isNumeric = false;
    } else {
      totalScore += scoreVal;
    }
  });

  const myGradesColumnData = [
    { id: "subject", label: "Subject" },
    { id: "teacherName", label: "Teacher " },
    {
      id: "marks",
      label: "Marks",
      render: (value, row) => <h1>{`${row.marks} / ${row.maxmarks}`}</h1>,
    },
    {
      id: "percentage",
      label: "Percentage",
      render: (value) => <h1>{`${value}%` || "—"}</h1>,
    },

    {
      id: "gradeAwarded",
      label: "Grade",
      render: (value) => <h1>{value || "—"}</h1>,
    },
    {
      id: "feedback",
      label: "Feedback",
      render: (value) => <h1>{value || "No feedback"}</h1>,
    },
  ];

  const averageScore =
    isNumeric && myGrades.length > 0
      ? (totalScore / myGrades.length).toFixed(2)
      : "N/A ";

  return (
    <>
      <Box className="p-2 flex gap-3 print:hidden">
        <Button
          variant="outlined"
          color="primary"
          className="transition-all duration-500 hover:scale-105 hover:-translate-z-5"
          onClick={() => handlePrint()}
        >
          Print Report Card
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="transition-all duration-500 hover:scale-105 hover:-translate-z-5"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          startIcon={
            isDownloading ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          {isDownloading ? "Downloading..." : "Download PDF"}
        </Button>
      </Box>

      <div ref={contentRef} className="report-wrapper">
        <div className="report-card report-card-one">
          <div className="header">
            <h1>REPORT CARD</h1>

            <p>
              Academic Session :{new Date().getFullYear() - 1} -
              {new Date().getFullYear()}
            </p>
          </div>

          <hr />

          <div className="student-info">
            <p>
              <strong>Student Name:</strong>
              {studentName}
            </p>

            <p>
              <strong>Email:</strong>
              {studentEmail}
            </p>

            <p>
              <strong>Class:</strong>
              {myClassName}
            </p>

            <p>
              <strong>Roll No:</strong>
              {myRollNo}
            </p>
          </div>

          <hr />

          <div className="performance-section">
            <h2>Academic Performance</h2>

            <ReusableTable columns={myGradesColumnData} data={myGrades} />
          </div>

          <div className="summary-section">
            <h2>Summary</h2>

            <div className="summary-row">
              <span>Total Subjects:</span>

              <strong>{myGrades.length}</strong>
            </div>

            <div className="summary-row">
              <span>Average Score:</span>

              <strong>{averageScore}%</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
