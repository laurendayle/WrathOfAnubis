import React, { useState, useEffect, useContext } from "react";
import List from "@mui/material/List";
import styled from "styled-components";
import { SocketContext } from "../../socket/socket";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { userState } from "../../_states/tokenState";
import { useRecoilValue } from "recoil";
import { shadows } from "@mui/system";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from 'next/router';


export default function PlayChatRoom({messages}) {
  const userData = useRecoilValue(userState);

  const alignMessage = (message) => {
    if (message.user_id === userData.userId) {
      return "chatMessage-right";
    } else {
      return "chatMessage-left";
    }
  };

  return (
    <div style={{minWidth: '250px', maxWidth: '300px'}}>
    <StyledChatBox
      disableGutters={true}
      maxWidth={false}
      id="chatList-container"
    >
      <StyledBox>
        <Typography
          variant="h6"
          noWrap
          component="p"
          sx={{
            fontFamily: 'Josefin Slab',
            fontWeight: 700,
            fontSize: '1.3em',
            letterSpacing: ".2em",
            color: "inherit",
            textDecoration: "none",
            paddingTop: '2px'
          }}
        >
          CHAT
        </Typography>
      </StyledBox>
      <div id="chatList-outerContainer">
        <div id="chatList">
          {messages.map((message, index) => {
            return (

              <div key={JSON.stringify(message)} className={`message-container ${alignMessage(message)}`}>
                  <span className="chatUser">{`${message.userName}: `}</span>
                  <span className="chatMessage">{message.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </StyledChatBox>
    </div>
  );
}


const StyledChatBox = styled(Container)`
  border: 1px solid gray;
  border-bottom: none;
  background-color: #F1F7ED;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  height: 85vh;
  max-height: 90vh;
  overflow-y: scroll;
  margin-top: 10px;
  border-radius: 5px 5px 0 0;
    /* hides the scrollbar in IE, Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledBox = styled(Box)`
  height: 35px;
  box-shadow: 1;
  width: 100%;
  background-color: #9a8249;
  text-align: center;
  color: white;
  position: sticky;
  top: 0px;
  z-index: 1;
`;
