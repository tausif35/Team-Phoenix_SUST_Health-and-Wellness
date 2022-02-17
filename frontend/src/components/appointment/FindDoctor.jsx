
import { SearchOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const specializationList = ["A", "B", "C"];

function FindDoctor() {
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("");

  const handleSearchClick = () => {
    console.log(doctorName, specialty);
  };

  return (
    <Stack spacing={4} alignItems="center" px={4}>
      <Paper sx={{ width: "100%", maxWidth: "1000px" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          p={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6">Search</Typography>

          <TextField
            fullWidth
            variant="outlined"
            label="Doctor's Name"
            type={"text"}
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          />

          <Autocomplete
            fullWidth
            options={specializationList}
            getOptionLabel={(option) => option}
            onChange={(e, values) => setSpecialty(values)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Specialization"
              />
            )}
          />

          <Button fullWidth variant="contained" onClick={handleSearchClick}>
            Search
            <SearchOutlined sx={{ ml: 2 }} />
          </Button>

        </Stack>
      </Paper>
    </Stack>
  );
}

export default FindDoctor;
