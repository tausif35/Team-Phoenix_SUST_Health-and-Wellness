import { Avatar, Button, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPatientAppointments } from "../../actions/appointmentActions";
import {
  API_HOST,
  DELETE_APPOINTMENTS,
  GET_APPOINTMENT_PRESCRIPTION,
} from "../../constants/apiLinks";

function AppointmentItem({ item, userInfo, handleMakePrescriptionClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const handleCancelAppointmentClick = async (id) => {
    try {
      const res = await axios.delete(`${DELETE_APPOINTMENTS}/${id}`, config);

      dispatch(getPatientAppointments());
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPrescriptionClick = async (id) => {
    try {
      const res = await axios.get(
        `${GET_APPOINTMENT_PRESCRIPTION}/${id}`,
        config
      );

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChatClick = (id) => {
    navigate("/appointments/chat");
  };
  return (
    <Paper sx={{ width: "100%", maxWidth: "1000px" }}>
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
            item.doctorId.profileImage &&
            `${API_HOST}/${item.doctorId.profileImage}`
          }
          sx={{ width: 80, height: 80 }}
        />

        <Stack spacing={2}>
          <Typography variant="body1" fontWeight={"bold"}>
            {item.doctorId.name}
          </Typography>
          <Typography variant="body1">
            {item.date} {item.time}
          </Typography>
        </Stack>
        <Typography variant="body1" fontWeight={"bold"}>
          {item.appointmentTitle}
        </Typography>
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleChatClick(item._id)}
          >
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
            onClick={(e) => handleCancelAppointmentClick(item._id)}
          >
            Cancel Appointment
          </Button>
          {userInfo.role === "user" && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleGetPrescriptionClick(item._id)}
            >
              Get prescription
            </Button>
          )}

          {userInfo.role === "doctor" && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleMakePrescriptionClick(item._id)}
            >
              Make prescription
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

export default AppointmentItem;