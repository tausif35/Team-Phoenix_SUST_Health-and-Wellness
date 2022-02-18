import { Button, Grid, Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BlogFilter from "../components/blog/BlogFilter";
import BlogListItem from "../components/blog/BlogListItem";
import PersonalBlog from "../components/blog/PersonalBlog";

function BlogsPage() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);

  const handleWriteBlogClick = () => {
    navigate("/blogs/create");
  };

  const blogs = [];
  return (
    <Grid container spacing={4} p={4} columns={{ xs: 1, md: 9 }}>
      <Grid item xs={1} md={2}>
        <BlogFilter />
      </Grid>
      <Grid item xs={1} md={5} display="flex">
        <Stack spacing={4} width={"100%"} alignItems={"center"}>
          {userInfo.role === "doctor" && (
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleWriteBlogClick}
            >
              Write you own blog
            </Button>
          )}

          {blogs.map((item, index) => (
            <BlogListItem key={index} item={item} />
          ))}
        </Stack>
      </Grid>
      <Grid item xs={1} md={2}>
        {userInfo.role === "doctor" && <PersonalBlog />}
      </Grid>
    </Grid>
  );
}

export default BlogsPage;
