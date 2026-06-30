"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useRouter } from "next/navigation";

export default function RequestBook() {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role;
  const [libraryData, setLibraryData] = useLocalStorage("libraryBooks", []);
  const [issuedData, setIssuedData] = useLocalStorage("libraryIssued", []);
  const [requests, setRequests] = useLocalStorage("libraryRequest", []);

  const handleBookView = (viewBookId) => {
    if (userRole.toUpperCase() === "LIBRARIAN") {
      router.push(`/dashboard/library/allbooks/${viewBookId}`);
    }
  };
  const handleDelete = (deleteId) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }
    try {
      setLibraryData(
        libraryData.filter((book) => String(book.id) !== String(deleteId)),
      );
      setRequests(
        requests.filter(
          (request) => String(request.bookId) !== String(deleteId),
        ),
      );
      setIssuedData(
        issuedData.filter(
          (issued) => String(issued.bookId) !== String(deleteId),
        ),
      );
      toastMessage("Book and related records deleted successfully", "success");
    } catch (error) {
      console.error(error);
      toastMessage("Failed to delete book records", "error");
    }
  };

  return (
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
          const alreadyRequested = requests.some(
            (request) =>
              String(request.bookId) === String(item.id) &&
              String(request.userId) === String(session?.user?.id) &&
              request.status.toUpperCase() === "PENDING",
          );

          return (
            <Grid xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card
                elevation={0}
                className="flex flex-col h-full rounded-2xlw-full border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <Typography
                    variant="h6"
                    className="text-gray-900 font-semibold leading-tight"
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    className="font-bold text-gray-500 tracking-wider uppercase"
                  >
                    {item.author}
                  </Typography>

                  <Typography variant="body2" className="mt-2 text-gray-600">
                    Available: {item.available}
                  </Typography>
                </CardContent>

                <CardActions className="p-6 pt-0 mt-auto">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookView(item.id)}
                    className="rounded-xl py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-none hover:shadow-sm"
                  >
                    View
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      router.push(`/dashboard/library/addbook/${item.id}`)
                    }
                    className="rounded-xl py-2.5 font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-none hover:shadow-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-xl py-2.5 font-semibold transition-colors shadow-none hover:shadow-sm"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
