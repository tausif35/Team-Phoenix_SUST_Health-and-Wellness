import { Paper, Stack, Avatar, Typography, Grid, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { getPatientAppointments } from "../../actions/appointmentActions";
import { API_HOST } from "../../constants/apiLinks";

function UserAppointments() {
  const dispatch = useDispatch();
  const { loading, error, appointments } = useSelector(
    (state) => state.patientAppointmentList
  );

  useEffect(() => {
    dispatch(getPatientAppointments());
  }, [dispatch]);

  return (
    <Stack spacing={4} alignItems={"center"}>
      {appointments.length ? (
        appointments.map((item, index) => (
          <Paper key={index} sx={{ width: "100%", maxWidth: "1000px" }}>
            <Stack
              spacing={4}
              p={2}
              direction={{ xs: "column", md: "row" }}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Avatar
                alt="Profile Picture"
                src={
                  item.doctorProfileImage &&
                  `${API_HOST}/${item.doctorProfileImage}`
                }
                sx={{ width: 80, height: 80 }}
              />

              <Stack spacing={2}>
                <Typography variant="body1" fontWeight={"bold"}>
                  {item.doctorName}
                </Typography>
                <Typography variant="body1">
                  {item.date} {item.time}
                </Typography>
              </Stack>
              <Typography variant="body1" fontWeight={"bold"}>
                {item.appointmentTitle} asdasdasdasd
              </Typography>

              <Button variant="contained" color="error">
                Cancel Appointment
              </Button>
              <Stack spacing={2}>
                <Button variant="contained">Chat</Button>
                <Button variant="contained">Join Scission</Button>
              </Stack>
            </Stack>
          </Paper>
        ))
      ) : (
        <></>
      )}
    </Stack>
  );
}

export default UserAppointments;
