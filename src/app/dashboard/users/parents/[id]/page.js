"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Container,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";
import ReusableTable from "@/components/reusable/ReusableDataTable";
import { Label } from "@mui/icons-material";
import Link from "next/link";

export default function StudentDetails() {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = useParams();
  const [userData] = useLocalStorage("userData", []);
  const [assignedCourses] = useLocalStorage("assignedCourses", []);
  const [classStudent] = useLocalStorage("classStudent", []);
  const [grades] = useLocalStorage("grades", []);
  const [attendance] = useLocalStorage("attendance", []);
  const [parentChildData] = useLocalStorage("parentChildData", []);
  const findParents = userData.find((user) => String(user.id) === String(id));


  if (!session) return null;

  if (!findParents)
    return <Typography className="p-4">Student not found.</Typography>;

  //
  const parentsName =
    findParents.name || `${findParents.firstname} ${findParents.lastname}`;
  const parentEmail = findParents.email;

  //
  const myChildren = userData?.filter(
    (parentChild) =>
      parentChild.parentName === parentsName ||
      parentChild.parentEmail === parentEmail,
  );

  const myChildrenColoumn = [
    {
      id: "id",
      label: "Id",
      render: (value, row) => (
        <Typography
          className=""
          component={Link}
          href={`/dashboard/users/students/${row.id}`}
        >
          {row.id}
        </Typography>
      ),
    },
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "age", label: "Age" },
  ];

  if (session?.user?.role?.toUpperCase() === "ADMIN") {
    return (
      <Container maxWidth="xl" className="mt-6 mb-12 gap-5 grid ">
        <Box className=" flex flex-row justify-between">
          <Typography
            variant="h4"
            fontWeight="bold"
            className="text-gray-800 mb-6 px-2 text-center"
          >
            Parents Overview
          </Typography>
          <Box className="justify-end">
            <Button
              color="primary"
              size="medium"
              variant="contained"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* parent card */}
        <Box className=" rounded-2xl border border-slate-200 overflow-hidden ">
          {/* Header */}
          <Box className=" px-8 py-7  flex-row flex justify-between bg-gradient-to-tr from-[#1aa398]">
            <Box className="flex flex-col lg:flex-row lg:items-center gap-6">
              <Avatar
                alt={parentsName}
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2.5rem",
                  bgcolor: "#3254b12",
                }}
              >
                {parentsName.charAt(0).toUpperCase()}
              </Avatar>
              <Box className="rounded-2xl   border-gray-100  p-5  transition-all duration-200 text-white hover:scale-105">
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  className="text-gray-900"
                >
                  {parentsName}
                </Typography>

                <Typography variant="body1" className="text-black mt-1">
                  {findParents
                    ? ` Total Children : ${findParents.studentNames.length}`
                    : "Not assigned to any Child"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8 hover:bg-[#c3ddf12b]">
            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 hover:-translate-y-1 ">
              <Typography
                variant="caption"
                className="text-gray-500  font-semibold"
              >
                Email
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1 break-all"
              >
                {parentEmail}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 ">
              <Typography
                variant="caption"
                className="text-gray-500  font-semibold"
              >
                Contact
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findParents.contact}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265]  transition-all duration-200 text-white hover:scale-105 ">
              <Typography
                variant="caption"
                className="text-gray-500  font-semibold"
              >
                Address
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findParents.address
                  ? `${findParents.address}, ${findParents.city}, ${findParents.state}`
                  : "Address N/A"}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 ">
              <Typography
                variant="caption"
                className="text-gray-500 font-semibold"
              >
                Age
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findParents.age}
              </Typography>
            </Box>

            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105">
              <Typography
                variant="caption"
                className="text-gray-500  font-semibold"
              >
                Gender
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {findParents.gender}
              </Typography>
            </Box>
            <Box className="rounded-2xl border border-gray-100  p-5 bg-[#d1ebf265] transition-all duration-200 text-white hover:scale-105 ">
              <Typography
                variant="caption"
                className="text-gray-500  font-semibold"
              >
                Children
              </Typography>
              <Typography
                variant="body1"
                className="font-medium text-gray-800 mt-1"
              >
                {myChildren && myChildren.length > 0
                  ? myChildren.map((child) => child.name).join(", ")
                  : "No Child assigned yet"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* myChildren */}

        <Grid
         
          className=" border-2 border-[#eff6ff]/90 rounded-2xl overflow-auto"
        >
          <Box className="justify-between items-center flex flex-row  bg-[#eff6ff] p-3 ">
            <Typography variant="h6" className="mb-4 font-semibold  p-3  ">
              Assigned {myChildren.length > 1 ? "Children" : "Child"}
            </Typography>

            <Chip
              label={`${myChildren?.length || 0} ${myChildren.length > 1 ? "children" : "child"} `}
              color="primary"
            />
          </Box>

          <ReusableTable data={myChildren || []} columns={myChildrenColoumn} />
        </Grid>
      </Container>
    );
  }

  return null;
}
