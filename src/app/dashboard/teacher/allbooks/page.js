"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/components/reusable/reusableToast";

const generateId = () => Date.now();

export default function RequestBook() {
  const { data: session } = useSession();

  const userRole = session?.user?.role;

  const [userData] = useLocalStorage("userData", []);
  const [libraryData] = useLocalStorage("libraryBooks", []);
  const [issuedBooks] = useLocalStorage("libraryIssued", []);
  const [requests, setRequests] = useLocalStorage("libraryRequest", []);

  // /////
  const handleReqBook = (reqBookId) => {
    if (!session?.user) {
      toastMessage("Please login first", "error");
      return;
    }

    if (!["STUDENT", "TEACHER"].includes(userRole?.toUpperCase())) {
      toastMessage("Only students and teachers can request books", "error");
      return;
    }
    const book = libraryData.find(
      (item) => String(item.id) === String(reqBookId),
    );

    if (!book) {
      toastMessage("Book not found", "error");
      return;
    }

    const user = userData.find(
      (item) => String(item.id) === String(session.user.id),
    );

    if (!user) {
      toastMessage("User not found", "error");
      return;
    }

    if (book.available <= 0) {
      toastMessage("Book is currently unavailable", "error");
      return;
    }

    const alreadyRequested = requests.some(
      (request) =>
        String(request.bookId) === String(book.id) &&
        String(request.userId) === String(user.id) &&
        String(request?.status).toUpperCase() === "PENDING",
    );

    if (alreadyRequested) {
      toastMessage("You have already requested this book", "error");
      return;
    }

    const alreadyIssued = issuedBooks.some(
      (issue) =>
        String(issue.bookId) === String(book.id) &&
        String(issue.userId) === String(user.id) &&
        String(issue?.status).toUpperCase() === "ISSUED",
    );

    if (alreadyIssued) {
      toastMessage("This book is already issued to you", "error");
      return;
    }

    const newRequest = {
      id: generateId(),
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      requestDate: new Date().toISOString(),
      status: "Pending",
      issueDate: null,
      dueDate: null,
      returnedDate: null,
      returnStatus: "Not_Returned",
    };
    setRequests([newRequest, ...requests]);
    toastMessage("Book request submitted successfully", "success");
  };


  return (
    
    <Container
      maxWidth="xl"
      elevation={3}
      className="rounded-2xl p-4 h-full flex flex-col"
    >
      <Box className="p-6 w-full">
        <Typography
          variant="h5"
          component="h2"
          className="mb-8 font-bold text-gray-800"
      >
        Library Books
      </Typography>

      <Grid container spacing={3}>
        {libraryData.map((item) => {
          const userRequest = requests.find(
            (request) =>
              String(request.bookId) === String(item.id) &&
              String(request.userId) === String(session?.user?.id),
          );

          const isIssued = issuedBooks.some(
            (issue) =>
              String(issue.bookId) === String(item.id) &&
              String(issue.userId) === String(session?.user?.id) &&
              String(issue?.status).toUpperCase() === "ISSUED",
          );

          const isPending = userRequest?.status.toUpperCase() === "PENDING";
          const isReturned = userRequest?.status.toUpperCase() === "RETURNED";
          const isApproved = userRequest?.status.toUpperCase() === "APPROVED";
          const isRejected = userRequest?.status.toUpperCase() === "REJECTED";

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                elevation={0}
                className="flex flex-col h-full rounded-2xl w-48 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-6  text-center justify-between">
                  <Typography
                    variant="caption2"
                    className="text-gray-900 font-semibold leading-tight"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    className="font-bold text-gray-500 tracking-wider "
                  >
                    {item.author}
                  </Typography>

                  {userRequest && (
                    <Box className="mt-3">
                      <Chip
                        label={`Status: ${userRequest.status}`}
                        size="small"
                        color={
                          isPending
                            ? "warning"
                            : isApproved
                              ? "success"
                              : isRejected
                                ? "error"
                                : isReturned
                                  ? "secondary"
                                  : "default"
                        }
                        variant="outlined"
                      />
                    </Box>
                  )}
                </CardContent>

                <CardActions className="p-6 pt-0 mt-auto">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleReqBook(item.id)}
                    disabled={item.available <= 0 || isPending || isIssued}
                    className="rounded-xl py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-none hover:shadow-sm disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {isPending
                      ? "Request Pending"
                      : isIssued
                        ? "Already Issued"
                        : item.available <= 0
                          ? "Unavailable"
                          : "Request Book"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
    </Container>
  );
}
