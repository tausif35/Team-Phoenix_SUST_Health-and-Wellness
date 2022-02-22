import { Stack, Button } from "@mui/material";
import ChatField from "../components/chat/ChatField";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatBox from "../components/chat/ChatBox";

function ChatPage() {
  const [searchParams] = useSearchParams();
  const [messageList, setMessageList] = useState([]);

  const chatRoomId = searchParams.get("roomId");

  const { loading, error, socket } = useSelector(
    (state) => state.socketConnection
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (socket && chatRoomId) {
      socket.emit("join-chat-room", chatRoomId, userInfo.name);

      socket.on("user-connected", (userName) => {
        console.log("user-connected " + userName);
      });

      socket.on("user-sent-Msg", (data) => {
        console.log(data);
        setMessageList((previousMessages) => [
          ...previousMessages,
          {
            isReceived: true,
            sender: data.sender,
            text: data.text,
            timeStamp: data.timeStamp,
          },
        ]);
      });
    }
  }, [chatRoomId, socket]);

  const handleChatSend = (chatText) => {
    const sendingTime = Date.now();

    socket.emit("chatMsg", {
      roomId: chatRoomId,
      text: chatText,
      sender: userInfo.name,
      timeStamp: sendingTime,
    });

    setMessageList((previousMessages) => [
      ...previousMessages,
      {
        isReceived: false,
        sender: "Me",
        text: chatText,
        timeStamp: sendingTime,
      },
    ]);
  };

  return (
    <Stack spacing={2} py={2}>
      <Button variant={"contained"} sx={{ mx: 2 }}>
        Set Another Appointment
      </Button>

      <ChatBox messageList={messageList} />

      <ChatField handleChatSend={handleChatSend} />
    </Stack>
  );
}

export default ChatPage;
