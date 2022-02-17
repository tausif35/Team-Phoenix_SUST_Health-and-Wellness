import { SearchOutlined } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Button,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doctorList } from "../../actions/appointmentActions";
import { specializationList } from "../../utils/categoryList";
import DoctorItem from "./DoctorItem";

function FindDoctor() {
  const dispatch = useDispatch();

  const [doctorName, setDoctorName] = useState("");
  const [speciality, setSpeciality] = useState("");

  const { loading, error, doctors } = useSelector((state) => state.doctorList);

  useEffect(() => {
    dispatch(doctorList(doctorName, speciality));
  }, []);

  const handleSearchClick = () => {
    dispatch(doctorList(doctorName, speciality));
  };

  return (
    <Stack spacing={4} px={4}>
      <Paper sx={{ width: "100%", maxWidth: "1000px", alignSelf: "center" }}>
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
            onChange={(e, values) => setSpeciality(values)}
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

      {loading && <LinearProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2} columns={{ xs: 1, sm: 3, md: 4, lg: 5 }}>
        {doctors.map((item, index) => (
          <Grid item xs={1} key={index}>
            <DoctorItem item={item} onItemClick={(id) => console.log(id)} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default FindDoctor;
