import styled from "@emotion/styled";
import { Stack, Paper, Box, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useRef } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 70vh;
  padding: 1rem 2rem;

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 16px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-track:hover {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #f4f4f4;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #a0a0a5;
    border: 4px solid #f4f4f4;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`;

function ChatBox({ messageList }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <Container>
      {messageList.map((msg, index) => (
        <Paper
          key={index}
          variant={"outlined"}
          sx={{
            background: msg.isReceived ? "#1976D2" : "#fff",
            p: 2,
            alignSelf: msg.isReceived ? "start" : "end",
          }}
        >
          <Stack spacing={1} alignItems={msg.isReceived ? "start" : "end"}>
            <Typography
              variant="body1"
              fontWeight={"bold"}
              color={msg.isReceived ? "#fff" : "primary"}
            >
              {msg.sender}
            </Typography>

            <Typography
              variant="caption"
              color={msg.isReceived ? "#fff" : "primary"}
            >
              {moment(Number(msg.timeStamp)).format(
                "ddd, MMM DD, YYYY, h:mm a"
              )}
            </Typography>

            <Typography
              variant="body1"
              color={msg.isReceived ? "#fff" : "primary"}
            >
              <pre style={{ fontFamily: "inherit", margin: 0 }}>{msg.text}</pre>
            </Typography>
          </Stack>
        </Paper>
      ))}

      <div ref={messagesEndRef} />
    </Container>
  );
}

export default ChatBox;
