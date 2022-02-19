import { Paper, Stack, Avatar, Typography, Grid, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { getPatientAppointments } from "../../actions/appointmentActions";
import { API_HOST, DELETE_APPOINTMENTS } from "../../constants/apiLinks";
import axios from "axios";

function UserAppointments() {
  const dispatch = useDispatch();
  const { loading, error, appointments } = useSelector(
    (state) => state.patientAppointmentList
  );
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    dispatch(getPatientAppointments());
  }, [dispatch]);

  const handleCancelAppointmentClick = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const res = await axios.delete(`${DELETE_APPOINTMENTS}/${id}`, config);

      console.log(res.data);

      dispatch(getPatientAppointments());
    } catch (error) {
      console.log(error);
    }
  };

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
              <Stack spacing={2}>
                <Button fullWidth variant="contained">
                  Chat
                </Button>
                <Button fullWidth variant="contained">
                  Join session
                </Button>
              </Stack>

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => handleCancelAppointmentClick(item._id)}
                >
                  Cancel Appointment
                </Button>
                <Button fullWidth variant="contained">
                  Get prescription
                </Button>
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
