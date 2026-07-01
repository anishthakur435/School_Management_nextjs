"use client";
import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function FormField({
  name,
  control,
  label,
  type = "text",
  slotProps,
  ...rest
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            slotProps={slotProps}
            label={label}
            type={type}
            error={!!error}
            helperText={error ? error.message : ""}
            {...rest}
          />
        );
      }}
    />
  );
}
