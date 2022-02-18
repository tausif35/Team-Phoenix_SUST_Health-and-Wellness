import { Send } from "@mui/icons-material";
import {
  Divider,
  Stack,
  Typography,
  Chip,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleQuestion } from "../actions/queAnsActions";
import SingleQuestion from "../components/que_ans/SingleQuestion";

function SingleQnAPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { loading, error, question } = useSelector(
    (state) => state.singleQuestion
  );

  useEffect(() => {
    dispatch(getSingleQuestion(params.questionId));
  }, [dispatch, params.questionId]);

  return question && Object.keys(question).length ? (
    <Stack spacing={4} alignItems="center" p={4}>
      <SingleQuestion item={question} />

      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          borderRadius: "100px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <InputBase placeholder="Comment here" sx={{ pl: 2, flex: 1 }} />
        <IconButton sx={{ p: "10px" }} color="primary">
          <Send />
        </IconButton>
      </Paper>
    </Stack>
  ) : (
    <></>
  );
}

export default SingleQnAPage;
