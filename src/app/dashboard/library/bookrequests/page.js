"use client";

import React from "react";
import useLocalStorage from "use-local-storage";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useRouter } from "next/navigation";

export default function LibraryRequests() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useLocalStorage("libraryRequest", []);
  const [libraryBooks, setLibraryBooks] = useLocalStorage("libraryBooks", []);
  const [issuedBooks, setIssuedBooks] = useLocalStorage("libraryIssued", []);

  const pendingRequests = requests.filter(
    (req) => req.status.toUpperCase() === "PENDING",
  );

  // //////
  const handleAction = (requestId, action) => {
    const request = requests.find(
      (req) => String(req.id) === String(requestId),
    );
    if (!request) return;
    if (action.toUpperCase() === "APPROVED") {
      const book = libraryBooks.find(
        (b) => String(b.id) === String(request.bookId),
      );
      if (!book) {
        toastMessage("Book not found", "error");
        return;
      }
      if (book.available <= 0) {
        toastMessage("Book unavailable", "error");
        return;
      }
      const issuedBook = {
        id: Date.now(),
        requestId: request.id,
        bookId: request.bookId,
        title: request.bookTitle,
        author: request.bookAuthor,
        userId: request.userId,
        userName: request.userName,
        userEmail: request.userEmail,
        issueDate: new Date().toLocaleDateString(),
        dueDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
        status: "Issued",
      };

      setIssuedBooks([issuedBook, ...issuedBooks]);

      setLibraryBooks(
        libraryBooks.map((book) =>
          String(book.id) === String(request.bookId)
            ? {
                ...book,
                available: Number(book.available) - 1,
              }
            : book,
        ),
      );

      setRequests(
        requests.map((req) =>
          String(req.id) === String(requestId)
            ? {
                ...req,
                status: "Approved",
                approvedBy: session?.user?.id,
                approvedDate: new Date().toISOString(),
              }
            : req,
        ),
      );
      toastMessage("Request Approved", "success");
      router.push("/dashboard/library/issuedbook");
    }

    if (action.toUpperCase() === "REJECTED") {
      setRequests(
        requests.map((req) =>
          String(req.id) === String(requestId)
            ? {
                ...req,
                status: "Rejected",
                rejectedBy: session?.user?.id,
                rejectedDate: new Date().toISOString(),
              }
            : req,
        ),
      );
      toastMessage("Request Rejected", "error");
      router.push("/dashboard");
    }
  };

  //
  const columns = [
    {
      id: "bookTitle",
      label: "Book",
    },
    {
      id: "bookAuthor",
      label: "Author",
    },
    {
      id: "userName",
      label: "User",
    },
    {
      id: "userEmail",
      label: "Email",
    },
    {
      id: "userRole",
      label: "Role",
    },
    {
      id: "requestDate",
      label: "Requested On",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "action",
      label: "Action",
      render: (value, row) => {
        if (row.status.toUpperCase() === "PENDING") {
          return (
            <Select
              size="small"
              variant="outlined"
              value={row.status}
              onChange={(e) => handleAction(row.id, e.target.value)}
            >
              <MenuItem value="Pending">Select</MenuItem>
              <MenuItem value="Approved">Approve</MenuItem>
              <MenuItem value="Rejected">Reject</MenuItem>
            </Select>
          );
        }
      },
    },
  ];

  return (
    <>
      <Container maxWidth="false" className="mt-6 mb-12 gap-5 grid ">
        <Box className="p-6">
          <Typography variant="h4" className="mb-4 font-bold">
            Library Book Requests
          </Typography>

          <ReusableTable columns={columns} data={pendingRequests} />
        </Box>
      </Container>
    </>
  );
}
