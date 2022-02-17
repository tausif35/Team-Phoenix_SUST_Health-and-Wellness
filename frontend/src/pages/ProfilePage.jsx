import styled from "@emotion/styled";
import { AdminPanelSettings, Key, Person } from "@mui/icons-material";
import { Divider, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const StyledNavLink = styled(NavLink)`
  color: black;
  text-transform: capitalize;
  padding: 1rem;
  display: flex;
  align-item: center;
  justify-content: center;
  gap: 1rem;
  transition: 0.5s;

  :hover {
    background-color: #1976d24a;
  }

  &.active {
    background-color: #1976d2;
    color: #ffffff;
  }
`;

function ProfilePage() {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length) {
      navigate("/profile/account");
    } else {
      navigate("/sign-in");
    }
  }, [userInfo]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      divider={<Divider orientation="vertical" flexItem />}
      height={"100%"}
      justifyContent={"center"}
    >
      <Stack divider={<Divider />} minWidth={"250px"}>
        <Typography variant="h4" my={4} textAlign={"center"}>
          {userInfo.name}
        </Typography>
        <StyledNavLink to="/profile/account">
          <Person />
          <Typography variant="body1">Account</Typography>
        </StyledNavLink>
        <StyledNavLink to="/profile/change-password">
          <Key />
          <Typography variant="body1">Password</Typography>
        </StyledNavLink>
        <StyledNavLink to="/">
          <AdminPanelSettings />
          <Typography variant="body1">Other</Typography>
        </StyledNavLink>
      </Stack>
      <Box sx={{ flex: "1", p: 5 }}>
        <Outlet />
      </Box>
    </Stack>
  );
}

export default ProfilePage;
