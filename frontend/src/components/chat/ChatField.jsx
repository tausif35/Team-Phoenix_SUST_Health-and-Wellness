import { Send } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import { useState } from "react";

function ChatField() {
  const [chatText, setChatText] = useState("");

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
      <IconButton sx={{ p: "10px" }} color="primary">
        <Send />
      </IconButton>
    </Paper>
  );
}

export default ChatField;
