"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import { Box, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useParams, useRouter } from "next/navigation";

export default function EditBookDetails() {
  const { id } = useParams();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const [libraryData, setLibraryData] = useLocalStorage("libraryBooks", []);
  const [issuedBooks, setIssuedBooks] = useLocalStorage("libraryIssued", []);
  const [requests, setRequests] = useLocalStorage("libraryRequest", []);

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      author: "",
      copies: "",
    },
  });

  const editBookDetails = (updatedBookData) => {
    if (role?.toUpperCase() !== "LIBRARIAN") {
      toastMessage("Only librarians can edit book", "error");
      return;
    }

    const duplicateBook = libraryData.find(
      (book) =>
        String(book.id) !== String(id) &&
        book.title === updatedBookData.title &&
        book.author === updatedBookData.author,
    );

    if (duplicateBook) {
      toastMessage(
        "Another book with this title and author already exists",
        "error",
      );
      router.back();
      return;
    }

    const currentBook = libraryData.find(
      (book) => String(book.id) === String(id),
    );
    const issuedCount =
      Number(currentBook.copies) - Number(currentBook.available);
    const newCopies = Number(updatedBookData.copies);

    if (newCopies < issuedCount) {
      toastMessage(`Cannot reduce copies below ${issuedCount}.`, "error");
      return;
    }

    const updatedLibrary = libraryData.map((book) =>
      String(book.id) === String(id)
        ? {
            ...book,
            ...updatedBookData,
            copies: newCopies,
            available: newCopies - issuedCount,
          }
        : book,
    );
    setLibraryData(updatedLibrary);
    const updatedIssuedBooks = issuedBooks.map((issued) =>
      String(issued.bookId) === String(id)
        ? {
            ...issued,
            title: updatedBookData.title,
            author: updatedBookData.author,
          }
        : issued,
    );
    setIssuedBooks(updatedIssuedBooks);
    const updatedRequests = requests.map((req) =>
      String(req.bookId) === String(id)
        ? {
            ...req,
            bookTitle: updatedBookData.title,
            bookAuthor: updatedBookData.author,
          }
        : req,
    );
    setRequests(updatedRequests);
    toastMessage("Book updated successfully", "success");
    router.replace("/dashboard/library");
  };
  useEffect(() => {
    if (!id || !libraryData.length) return;
    const findBook = libraryData.find((book) => String(book.id) === String(id));

    if (findBook) {
      reset({
        title: findBook.title,
        author: findBook.author,
        copies: findBook.copies,
      });
    }
  }, [id, libraryData, reset]);

  return (
    <>
      <Box className="flex items-center justify-center p-4 md:p-8">
        <Box className="w-full max-w-xl bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
          <Box className="text-center mb-8">
            <Typography
              variant="h4"
              className="font-bold tracking-wide text-gray-800"
            >
              Edit Book
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(editBookDetails)}>
            <Box className="flex flex-col gap-6">
              <FormField
                control={control}
                label="Book Title"
                name="title"
                fullWidth
              />
              <FormField
                control={control}
                label="Author Name"
                name="author"
                fullWidth
              />
              <FormField
                control={control}
                label="Number of Copies"
                name="copies"
                type="number"
                fullWidth
              />

              <Button
                variant="contained"
                color="secondary"
                type="submit"
                size="large"
                className="mt-4 py-3.5 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Edit Book
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
