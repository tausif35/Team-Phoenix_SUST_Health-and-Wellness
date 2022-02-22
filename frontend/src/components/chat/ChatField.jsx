import { Send } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function ChatField({ handleChatSend }) {
  const [chatText, setChatText] = useState("");

  const handleMsgSend = () => {
    handleChatSend(chatText);
    setChatText("");
  };
  return (
    <Paper
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        width: "95%",
        borderRadius: "100px",
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        mx: "auto",
      }}
    >
      <InputBase
        placeholder="Write answer here"
        sx={{ pl: 2, flex: 1 }}
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
      />
      <IconButton
        disabled={chatText ? false : true}
        sx={{ p: "10px" }}
        color="primary"
        onClick={handleMsgSend}
      >
        <Send />
      </IconButton>
    </Paper>
  );
}

export default ChatField;
