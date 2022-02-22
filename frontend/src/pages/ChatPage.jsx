import { Stack, Paper, Typography } from "@mui/material";
import ChatField from "../components/chat/ChatField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [receivedMsg, setReceivedMsg] = useState([]);

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
        setReceivedMsg([
          ...receivedMsg,
          {
            isReceived: true,
            sender: data.sender,
            text: data.text,
            timeStamp: Date.now(),
          },
        ]);

        console.log(receivedMsg);
      });
    }
  }, [chatRoomId, socket]);

  const handleChatSend = (chatText) => {
    socket.emit("chatMsg", {
      roomId: chatRoomId,
      text: chatText,
      sender: userInfo.name,
    });

    setReceivedMsg([
      ...receivedMsg,
      {
        isReceived: false,
        sender: userInfo.name,
        text: chatText,
        timeStamp: Date.now(),
      },
    ]);
  };

  return (
    <Stack p={4}>
      <Stack spacing={2}>
        {receivedMsg.map((msg, index) => (
          <Paper
            key={index}
            sx={{ background: msg.isReceived ? "#1976D2" : "#fff" }}
          >
            <Stack spacing={1} p={2}>
              <Typography
                variant="body1"
                fontWeight={"bold"}
                color={msg.isReceived ? "#fff" : "primary"}
              >
                {msg.sender}
              </Typography>

              <Typography
                variant="body2"
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
                {msg.text}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <ChatField handleChatSend={handleChatSend} />
    </Stack>
  );
}

export default ChatPage;
