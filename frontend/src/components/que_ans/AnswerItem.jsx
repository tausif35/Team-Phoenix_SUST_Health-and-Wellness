import { ThumbUp } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upVoteAnAnswer } from "../../actions/queAnsActions";
import { UPVOTE_ANSWER } from "../../constants/apiLinks";

function AnswerItem({ item, userInfo }) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  const [isUpVoted, setIsUpVoted] = useState(
    item.upvotes.includes(userInfo.id)
  );

  const [answer, setAnswer] = useState(item ? item : {});

  const handleUpVoteClick = async () => {
    try {
      const res = await axios.post(
        `${UPVOTE_ANSWER}/${answer._id}`,
        { ansId: answer._id },
        config
      );

      setAnswer(res.data.data.ans);
      setIsUpVoted(!isUpVoted);
    } catch (error) {
      console.log(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  return (
    <Stack direction={"row"} m={2} spacing={2} alignItems="center">
      <Stack spacing={2}>
        <Typography variant="body1">Answerer name</Typography>

        <Typography variant="body1" color={"primary"}>
          {answer.upvotes.length} upvotes
        </Typography>
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Typography variant="body1" flex={1}>
        {answer.answer}
      </Typography>

      <IconButton onClick={handleUpVoteClick}>
        <ThumbUp color={isUpVoted ? "primary" : "#c8c8c8"} />
      </IconButton>

      <Stack spacing={1}></Stack>
    </Stack>
  );
}

export default AnswerItem;