"use client";

import React from "react";
import useLocalStorage from "use-local-storage";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useRouter } from "next/navigation";

export default function IssuedBooks() {
  const router = useRouter();
  const { data: session } = useSession();

  const [libraryData, setLibraryData] = useLocalStorage("libraryBooks", []);
  const [requests, setRequests] = useLocalStorage("libraryRequest", []);
  const [issuedBooks, setIssuedBooks] = useLocalStorage("libraryIssued", []);

  const issueBooksFilter = issuedBooks.filter(
    (book) => String(book.status).toUpperCase() === "ISSUED",
  );


  // ////////
  const handleReturnBook = (issueId, bookId) => {
    const updatedLibraryData = libraryData.map((book) =>
      String(book.id) === String(bookId)
        ? { ...book, available: Number(book.available) + 1 }
        : book,
    );
    setLibraryData(updatedLibraryData);

    const updatedIssuedBooks = issuedBooks.map((book) =>
      String(book.id) === String(issueId)
        ? {
            ...book,
            status: "Returned",
            returnDate: new Date().toLocaleDateString(),
          }
        : book,
    );
    setIssuedBooks(updatedIssuedBooks);

    setRequests(
      requests.map((req) =>
        String(req.bookId) === String(bookId)
          ? {
              ...req,
              status: "Returned",
            }
          : req,
      ),
    );

    toastMessage("Book returned successfully", "success");
    router.push("/dashboard/library");
  };

  // console.log("requests", requests);

  const issuedBookDataColumn = [
    { id: "title", label: "Title" },
    { id: "author", label: "Author" },
    { id: "userName", label: "Student" },
    { id: "userEmail", label: "Email" },
    { id: "dueDate", label: "Due Date" },
    { id: "issueDate", label: "Issued On" },
    {
      id: "actions",
      label: "Actions",
      render: (value, row) => (
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() => handleReturnBook(row.id, row.bookId)}
        >
          Returned
        </Button>
      ),
    },
  ];

  return (
    <>
      <Container maxWidth="lg" className="mt-6 mb-12 gap-5 grid ">
        <Grid
          size={6}
          className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
        >
          <Box className="justify-between flex flex-row  bg-[#eff6ff] ">
            <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
              Issued Books
            </Typography>
          </Box>
          <ReusableTable
            columns={issuedBookDataColumn}
            data={issueBooksFilter}
          />
        </Grid>
      </Container>
    </>
  );
}
