import {
  Avatar,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { API_HOST } from "../../constants/apiLinks";

function SetAppointment({ selectedDoctor }) {
  const [openAppointment, setOpenAppointment] = useState(false);

  return (
    <Stack spacing={5}>
      <Stack
        spacing={5}
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
      >
        <Avatar
          alt="Profile Picture"
          src={`${API_HOST}/${selectedDoctor.profileImage}`}
          sx={{ width: 300, height: 300 }}
        />
        <Stack
          spacing={2}
          alignSelf={{ xs: "start", md: "center" }}
          divider={<Divider />}
        >
          <Typography variant="h6">Name: {selectedDoctor.name}</Typography>
          <Typography variant="h6">Email: {selectedDoctor.email}</Typography>
          <Typography variant="h6">
            Phone Number: {selectedDoctor.phoneNo}
          </Typography>
          <Typography variant="h6">Gender: {selectedDoctor.gender}</Typography>
          <Typography variant="h6">
            Medical Rge.No: {selectedDoctor.medicalId}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        spacing={2}
        border="1px solid #6f6f6f"
        borderRadius={2}
        p={2}
        divider={<Divider />}
      >
        <Typography variant="h6">
          Qualifications:
          {selectedDoctor.qualifications.map((text, i) => (
            <Chip
              key={i}
              label={text}
              variant="outlined"
              sx={{ m: 1, fontSize: "1rem" }}
            />
          ))}
        </Typography>

        <Typography variant="h6">
          Specializations:
          {selectedDoctor.specializations.map((text, i) => (
            <Chip
              key={i}
              label={text}
              variant="outlined"
              sx={{ m: 1, fontSize: "1rem" }}
            />
          ))}
        </Typography>

        <Typography variant="h6">
          Workplaces:
          {selectedDoctor.workplaces.map((text, i) => (
            <Chip
              key={i}
              label={text}
              variant="outlined"
              sx={{ m: 1, fontSize: "1rem" }}
            />
          ))}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        onClick={(e) => setOpenAppointment(!openAppointment)}
      >
        {openAppointment ? "Cancel" : "Select Appointment"}
      </Button>
    </Stack>
  );
}

export default SetAppointment;
