import { Avatar, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import { borderRadius, Box } from "@mui/system";
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
        <Stack spacing={4} alignSelf={{ xs: "start", md: "center" }}>
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

      <Stack spacing={5} border="1px solid #6f6f6f" borderRadius={2} p={2}>
        <Typography variant="h6">
          Qualifications: {selectedDoctor.qualifications.join(", ")}
        </Typography>

        <Typography variant="h6">
          Specializations: {selectedDoctor.specializations.join(", ")}
        </Typography>

        <Typography variant="h6">
          Workplaces: {selectedDoctor.workplaces.join(", ")}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        onClick={(e) => setOpenAppointment(!openAppointment)}
      >
        {openAppointment ? "Cancel Appointment" : "Set Appointment"}
      </Button>
    </Stack>
  );
}

export default SetAppointment;
