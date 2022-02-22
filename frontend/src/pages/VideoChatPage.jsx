import { Button, TextField, Stack, Typography } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const UserVideo = styled.video`
  width: 300px;
`;

const CallerVideo = styled.video`
  width: 600px;
`;

function VideoChatPage() {
  const socket = io.connect("http://localhost:5005");

  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
      console.log(id);
    });

    socket.on("endCall", (data) => {
      leaveCall();
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  socket.on("callEnded", () => {
    connectionRef.current.destroy();
    navigate(-1);
  });

  const navigate = useNavigate();
  const leaveCall = () => {
    socket.emit("endCall", idToCall);

    setCallEnded(true);
    connectionRef.current.destroy();

    navigate(-1);
  };

  return (
    <Stack spacing={2} alignItems={"center"}>
      <Typography variant="h3">Video Chat</Typography>

      <Stack spacing={2} direction={"row"}>
        {stream && <UserVideo playsInline muted ref={myVideo} autoPlay />}
        {callAccepted && !callEnded ? (
          <CallerVideo playsInline ref={userVideo} autoPlay />
        ) : null}
      </Stack>

      {receivingCall && !callAccepted ? (
        <Stack spacing={2} direction={"row"}>
          <Typography variant="h5">{name} is calling...</Typography>

          <Button variant="contained" onClick={answerCall}>
            Answer Call
          </Button>
        </Stack>
      ) : null}

      <TextField
        label="Your Name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <CopyToClipboard text={me}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AssignmentIcon fontSize="large" />}
        >
          Copy ID
        </Button>
      </CopyToClipboard>

      <TextField
        label="ID to call"
        variant="outlined"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />

      {callAccepted && !callEnded ? (
        <Button variant="contained" color="error" onClick={leaveCall}>
          End Call
        </Button>
      ) : (
        <Button variant="contained" onClick={() => callUser(idToCall)}>
          Make Call
        </Button>
      )}

      <Typography variant="h5">{idToCall}</Typography>
    </Stack>
  );
}

export default VideoChatPage;
