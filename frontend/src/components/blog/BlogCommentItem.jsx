import { ThumbUp } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upVoteAnAnswer } from "../../actions/queAnsActions";
import { UPVOTE_ANSWER } from "../../constants/apiLinks";

function BlogCommentItem({ item }) {
  return (
    <Stack direction={"row"} m={2} spacing={2} alignItems="center">
      <Stack spacing={2}>
        <Typography variant="body1" fontWeight={"bold"}>
          {item.name}
        </Typography>
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Typography variant="body1" flex={1}>
        {item.comment}
      </Typography>

      <Stack spacing={1}></Stack>
    </Stack>
  );
}

export default BlogCommentItem;
