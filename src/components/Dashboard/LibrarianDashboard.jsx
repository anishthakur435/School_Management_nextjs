"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Container,
} from "@mui/material";
import ReusableTable from "@/components/reusable/ReusableDataTable";

export default function LibraryDashboard() {
  const { data: session } = useSession();
  const [userData] = useLocalStorage("userData", []);
  const [libraryData, setLibraryData] = useLocalStorage("libraryBooks", []);
  const [issuedBooks] = useLocalStorage("libraryIssued", []);

  //
  const findStudent = userData.find(
    (user) => String(user.role).toUpperCase() === "LIBRARIAN",
  );

  //
  const studentName =
    findStudent?.name ||
    `${findStudent?.firstname || ""} ${findStudent?.lastname || ""}`;
  const studentEmail = findStudent?.email;

  // add some books
  useEffect(() => {
    if (libraryData.length === 0) {
      const bookdata = [
        {
          id: "1",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          copies: 8,
          available: 8,
        },
        {
          id: "2",
          title: "The Diary of a Young Girl",
          author: "Anne Frank",
          copies: 5,
          available: 5,
        },
        {
          id: "3",
          title: "A Brief History of Time",
          author: "Stephen Hawking",
          copies: 4,
          available: 4,
        },
        {
          id: "4",
          title: "The Giver",
          author: "Lois Lowry",
          copies: 6,
          available: 6,
        },
        {
          id: "5",
          title: "Oxford School Dictionary",
          author: "Oxford University Press",
          copies: 10,
          available: 10,
        },
        {
          id: "6",
          title: "Animal Farm",
          author: "George Orwell",
          copies: 7,
          available: 7,
        },
      ];
      setLibraryData(bookdata);
    }
  }, []);

  //
  const returnedBooks = issuedBooks.filter(
    (book) => book.status.toUpperCase() === "RETURNED",
  );

  //

  const columns = [
    {
      id: "title",
      label: "Book",
    },
    {
      id: "author",
      label: "Author",
    },
    {
      id: "userName",
      label: "Student",
    },
    {
      id: "userEmail",
      label: "Email",
    },
    {
      id: "issueDate",
      label: "Issued On",
    },
    {
      id: "returnDate",
      label: "Returned On",
      render: (value) => (value ? value : "N/A"),
    },
  ];

  //
  const booksDataColums = [
    { id: "title", label: "Title" },
    { id: "author", label: "Author" },
    {
      id: "copies",
      label: "Availability",
      render: (value, row) => (
        <Chip label={`${row.available} / ${row.copies}`} />
      ),
    },
  ];

  return (
    <>
      <Container maxWidth="lg" className="mt-6 mb-12 gap-5 grid ">
        {/* librarian card */}
        <Box className="rounded-2xl border border-slate-200 overflow-hidden">
          <Box className="px-8  flex-col flex justify-between ">
            <Box className="flex flex-col lg:flex-row lg:items-center gap-6 p-5">
              <Avatar
                alt={studentName}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#546de5",
                }}
              >
                {studentName?.trim()
                  ? studentName.trim().charAt(0).toUpperCase()
                  : ""}
              </Avatar>
              <Box className="rounded-2xl  border-gray-100 p-5 transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  className="text-gray-900"
                >
                  {studentName}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 hover:bg-[#c3ddf12b]">
            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Email
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1 break-all"
              >
                {studentEmail}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Contact
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findStudent?.contact}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findStudent?.address
                  ? `${findStudent?.address}, ${findStudent?.city}, ${findStudent?.state}`
                  : "Address N/A"}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Age
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findStudent?.age ?? "N/A"}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500 uppercase tracking-wider font-semibold"
              >
                Gender
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findStudent?.gender ?? "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/*  */}
        <Box className="p-6">
          <Typography variant="h4" className="mb-4 font-bold">
            Returned Books
          </Typography>

          <ReusableTable columns={columns} data={returnedBooks} />
        </Box>
      </Container>
    </>
  );
}
