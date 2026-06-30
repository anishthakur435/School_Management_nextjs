import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ReusableTable({ columns, data }) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                className="!font-bold  !text-lg"
                key={column.id || index}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody
          sx={{
            "& tr:last-child td, & tr:last-child th": {
              borderBottom: 0,
            },
          }}
        >
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>No data available.</TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex} className="">
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id}>
                      {column.render ? column.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
