import { Button, Stack } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../actions/socketActions";
import ChatField from "../components/chat/ChatField";

function ChatPage() {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketConnection);

  useEffect(() => {
    dispatch(createSocketConnection());
  }, []);

  useEffect(() => {}, [socket]);

  return (
    <Stack>
      <Button
        onClick={() => {
          socket.emit("hello", { data: "asd" });
        }}
      >
        asdadasd
      </Button>
      <ChatField />
    </Stack>
  );
}

export default ChatPage;
