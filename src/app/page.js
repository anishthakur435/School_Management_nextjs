"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.replace("/dashboard");
    } else {
      router.replace("/signup");
    }
  }, [session, status, router]);

  return (
    <Box className="min-h-screen flex items-center justify-center">
      <CircularProgress sx={{ color: "#6366f1" }} size={40} />
    </Box>
  );
}
