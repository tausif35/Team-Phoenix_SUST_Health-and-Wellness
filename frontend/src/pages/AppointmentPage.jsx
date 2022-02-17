import { TabContext, TabPanel } from "@mui/lab";
import { Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FindDoctor from "../components/appointment/FindDoctor";
import UserAppointments from "../components/appointment/UserAppointments";

function AppointmentPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const type = searchParams.get("tab");

  const [tabValue, setTabValue] = useState("find-doctor");

  const handleTabChange = (e, newValue) => {
    navigate(`/appointments?tab=${newValue}`);
  };

  useEffect(() => {
    setTabValue(type ? type : "find-doctor");
  }, [type]);

  return (
    <TabContext value={tabValue}>
      <Stack spacing={5}>
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Find Doctors" value="find-doctor" />
          <Tab label="Your Appointments" value="your-appointments" />
        </Tabs>

        <TabPanel value={"find-doctor"}>
          <FindDoctor />
        </TabPanel>
        <TabPanel value={"your-appointments"}>
          <UserAppointments />
        </TabPanel>
      </Stack>
    </TabContext>
  );
}

export default AppointmentPage;
