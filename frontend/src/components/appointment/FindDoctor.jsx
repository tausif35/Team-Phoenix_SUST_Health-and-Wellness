import { Paper, Stack, TextField } from "@mui/material";
import React from "react";

function FindDoctor() {
  const handleChange = (prop) => (e) => {
    setValues({ ...values, [prop]: e.target.value });
  };

  return (
    <Stack spacing={4}>
      <Paper>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <TextField
            variant="outlined"
            label="Doctor's Name"
            type={"text"}
            value={values.email}
            onChange={handleChange("email")}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

export default FindDoctor;
