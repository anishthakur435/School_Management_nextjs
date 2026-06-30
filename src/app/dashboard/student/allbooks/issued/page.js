"use client";

import React from "react";
import useLocalStorage from "use-local-storage";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";

export default function IssuedBooks() {
  const { data: session } = useSession();
  const [issuedBooks] = useLocalStorage("libraryIssued", []);
  const userIssuedBook = issuedBooks.filter(
    (booksIssued) => String(booksIssued.userId) === String(session?.user?.id),
  );

  const issuedBookDataColumn = [
    { id: "title", label: "Title" },
    { id: "author", label: "Author" },
    {
      id: "issueDate",
      label: "Issued On",
      render: (value) => (
        <Chip label={value} variant="outlined" color="info" size="small" />
      ),
    },
    {
      id: "date",
      label: "Date",
      render: (value, row) =>
        row.status.toUpperCase() === "ISSUED" ? (
          <Chip
            color="error"
            variant="outlined"
            size="small"
            label={row.dueDate}
          />
        ) : row.status.toUpperCase() === "RETURNED" ? (
          <Chip
            variant="outlined"
            color="success"
            size="small"
            label={row.returnDate}
          />
        ) : (
          "N/A"
        ),
    },
    {
      id: "status",
      label: "Status",
      render: (value) => {
        const isReturned = value?.toLowerCase() === "returned";
        return (
          <Chip
            label={value}
            color={isReturned ? "default" : "primary"}
            variant={isReturned ? "outlined" : "filled"}
            size="small"
            className="font-medium"
          />
        );
      },
    },
  ];

  return (
    <Container maxWidth="lg" className="mt-8 mb-12">
      <Card
        elevation={0}
        className="border border-blue-100 rounded-2xl overflow-hidden shadow-sm"
      >
        <Box className="bg-[#eff6ff] px-6 py-5 border-b border-blue-100">
          <Typography variant="h5" className="font-semibold text-blue-900">
            Issued Books Details
          </Typography>
        </Box>

        <CardContent className="p-0 sm:p-0">
          {userIssuedBook.length > 0 ? (
            <Box className="w-full overflow-x-auto">
              <ReusableTable
                columns={issuedBookDataColumn}
                data={userIssuedBook}
              />
            </Box>
          ) : (
            <Box className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Typography
                variant="h6"
                className="text-gray-600 font-medium mb-1"
              >
                No Books Issued
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                You currently do not have any borrowed books associated with
                your account.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
