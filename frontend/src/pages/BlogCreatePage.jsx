import styled from "@emotion/styled";
import { Close, Delete } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputBase,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import RichEditor from "../components/RichEditor";

const CoverPic = styled.img`
  width: 100%;
  max-height: 300px;
  border-radius: 10px;
  object-fit: cover;
`;

const Label = styled.label`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

function BlogCreatePage() {
  const [valueMissing, setValueMissing] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogImage, setBlogImage] = useState(null);

  const onEditorChange = (value) => {
    setEditorValue(value);
    console.log(value);
  };

  const onFileSelect = (e) => {
    if (e.target.files[0]) {
      setBlogImage(e.target.files[0]);
    }
  };

  const handlePostClick = () => {
    if (editorValue && editorValue !== "<p><br></p>" && blogTitle) {
      console.log(editorValue);
    }
  };

  return (
    <Stack padding={4} bgcolor={"#fff"} alignItems="center">
      <Stack spacing={4} maxWidth="800px">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <CoverPic
            src={
              blogImage
                ? URL.createObjectURL(blogImage)
                : "https://healthtechmagazine.net/sites/healthtechmagazine.net/files/styles/cdw_hero/public/articles/%5Bcdw_tech_site%3Afield_site_shortname%5D/202007/20200630_HT_Web_MonITor_Tech-Organizations-Should-Consider.jpg?"
            }
          />

          <Label htmlFor="contained-button-file">
            <InputBase
              id="contained-button-file"
              type={"file"}
              name="profilePic"
              accept=".png, .jpg, .jpeg"
              onChange={onFileSelect}
              sx={{ display: "none" }}
            />
            <Button
              fullWidth
              variant="contained"
              component="span"
              color={"primary"}
            >
              Upload cover image
            </Button>
          </Label>

          {blogImage && (
            <IconButton
              color="error"
              sx={{ position: "absolute", top: "10px", right: "10px" }}
              onClick={() => setBlogImage(null)}
            >
              <Delete />
            </IconButton>
          )}
        </Box>

        <Stack spacing={1}>
          <Typography variant="h6">Blog Title</Typography>

          <TextField
            variant="outlined"
            placeholder="Give Title"
            error={valueMissing && !blogTitle}
            helperText={
              valueMissing && !blogTitle ? "Please write your blog title" : ""
            }
            onChange={(e) => setBlogTitle(e.target.value)}
            defaultValue=""
            inputProps={{ style: { fontSize: 20 } }}
          />
        </Stack>
        <RichEditor onEditorChange={onEditorChange} />

        <Button variant="contained" size="large" onClick={handlePostClick}>
          Post your blog
        </Button>
      </Stack>
    </Stack>
  );
}

export default BlogCreatePage;
