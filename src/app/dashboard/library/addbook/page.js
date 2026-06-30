"use client";
import React from "react";
import { useSession } from "next-auth/react";
import useLocalStorage from "use-local-storage";
import { Box, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import FormField from "@/components/reusable/reusableForm";
import { toastMessage } from "@/components/reusable/reusableToast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const generateId = () => Date.now();
const schema = Yup.object().shape({
  title: Yup.string().required("Enter a book title"),
  author: Yup.string().required("Author  is required"),
  copies: Yup.number()
    .typeError("Copies must be a number")
    .positive("must be positive number")
    .integer("Copies cannot be a decimal")
    .required(" Number of copies"),
});

export default function AddBookLibrary() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const [libraryData, setLibraryData] = useLocalStorage("libraryBooks", []);
  //
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      author: "",
      copies: "",
    },
  });

  const addBookLibrary = (newBookData) => {
    if (role?.toUpperCase() !== "LIBRARIAN") {
      toastMessage("Only librarian can add books", "error");
      return;
    }
    const findBook = libraryData.find(
      (book) =>
        book.title.toLowerCase() === newBookData.title.toLowerCase() &&
        book.author.toLowerCase() === newBookData.author.toLowerCase(),
    );
    if (findBook) {
      toastMessage("Book Already in Library", "error");
      return;
    }
    const newBook = {
      ...newBookData,
      id: generateId().toString(),
      available: Number(newBookData.copies),
    };

    setLibraryData([newBook, ...libraryData]);
    toastMessage("Added new book successfully", "success");
    router.push("/dashboard");
    reset();
  };

  return (
    <>
      <Box className="flex items-center justify-center p-4 md:p-8">
        <Box className="w-full max-w-xl bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
          <Box className="text-center mb-8">
            <Typography
              variant="h4"
              className="font-extrabold tracking-tight text-gray-900"
            >
              Add New Book
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-2">
              Enter the details below to add a book to the library catalog.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(addBookLibrary)}>
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
                Add Book
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
