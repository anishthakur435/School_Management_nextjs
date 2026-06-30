import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

export default function FormRadio({
  name,
  control,
  label,
  options = [],
  row = false,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error}>
          {label && <FormLabel>{label}</FormLabel>}
          <RadioGroup {...field} row={row}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
