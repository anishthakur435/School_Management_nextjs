"use client";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Typography,
} from "@mui/material";
import useLocalStorage from "use-local-storage";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useParams, useRouter } from "next/navigation";
import ReusableTable from "@/components/reusable/ReusableDataTable";

export default function ViewBookPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();

  const [libraryData] = useLocalStorage("libraryBooks", []);
  const [issuedBooks] = useLocalStorage("libraryIssued", []);
  const findBook = libraryData.find((book) => String(book.id) === String(id));
  const findBookIssueed = issuedBooks.filter(
    (book) => String(book.bookId) === String(id),
  );

  const findIssuedColumn = [
    { id: "userName", label: "Name" },
    { id: "userEmail", label: "Email" },
    { id: "issueDate", label: "Issue Date" },
    {
      id: "action",
      label: "Date",
      render: (value, row) =>
        row.status.toUpperCase() === "ISSUED" ? (
          <Chip color="error" label={row.dueDate} variant="outlined" />
        ) : row.status.toUpperCase() === "RETURNED" ? (
          <Chip color="success" label={row.returnDate} />
        ) : (
          "N/A"
        ),
    },
    {
      id: "status",
      label: "Status",
      render: (value) => <Typography>{value}</Typography>,
    },
  ];

  if (!findBook) {
    return (
      <Container maxWidth="false" className="mt-6 mb-12">
        <Typography variant="h5">Book not found</Typography>
      </Container>
    );
  }
  return (
    <>
      <Container maxWidth="false" className="mt-6 mb-12 gap-5 grid ">
        <Card>
          <CardContent>
            <Box className="flex flex-col lg:flex-row lg:items-center gap-6">
              <Avatar
                alt={findBook.title}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2.5rem",
                  bgcolor: "#546de5",
                }}
              >
                {findBook.title?.charAt(0).toUpperCase() || "Book Name"}
              </Avatar>
              <Box className="rounded-2xl  border-gray-100 p-5 transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  className="text-gray-900"
                >
                  {findBook.title}
                </Typography>

                <Typography variant="h6" className="text-black mt-1">
                  Author : {findBook.author}
                </Typography>
                <Typography variant="caption" className="text-black mt-1">
                  Availability : {findBook.available}/ {findBook.copies}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box>
          <Typography
            variant="h6"
            className="text-black mt-1  p-5 hover:bg-[#c3ddf12b] rounded-3xl overflow-hidden"
          >
            Book Issued to
          </Typography>
          <ReusableTable data={findBookIssueed} columns={findIssuedColumn} />
        </Box>
      </Container>
    </>
  );
}
