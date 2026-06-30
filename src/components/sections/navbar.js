"use client";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/signin" });
  };

  return (
    <AppBar position="static" elevation={0} className="">
      <Toolbar className="flex justify-between px-6 py-2">
        <Typography
          component={Link}
          href="/dashboard"
          variant="h6"
          className="hidden sm:block font-extrabold tracking-wide "
        >
          Delux School
        </Typography>

        <Box className="flex items-center gap-6">
          <Button
            variant="contained"
            color="error"
            onClick={handleSignOut}
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            className="rounded-xl px-4 py-1.5 font-semibold shadow-sm transition-all duration-100 text-white hover:scale-105 "
          >
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
