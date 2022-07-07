import React, { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import styled from 'styled-components';
import { SocketContext } from '../../socket/socket';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { userState } from '../../_states/tokenState';
import { useRecoilValue } from 'recoil';
import { shadows } from '@mui/system';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LobbyChatRoom() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const userData = useRecoilValue(userState);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('receive-message-lobby', (user, message) => {
      setMessages([...messages, message]);
    });
  });

  const alignMessage = (message) => {
    if (message.username === userData.userName) {
      return 'chatMessage-right';
    } else {
      return 'chatMessage-left';
    }
  };

  return (
    <StyledChatBox disableGutters={true} maxWidth={false} id='chatList-container'>
      <StyledBox>
        <Typography
          variant='h6'
          noWrap
          component='p'
          sx={{
            fontFamily: 'Roboto',
            fontWeight: 400,
            letterSpacing: '0.00938em',
            lineHeight: 1.5,
            fontSize: '1em',
            color: 'inherit',
            textDecoration: 'none',
            paddingTop: '5px',
          }}>
          CHAT
        </Typography>
      </StyledBox>
      <div id='chatList-outerContainer'>
        <div id='chatList'>
          {messages.map((message) => {
            return (
              <div
                key={JSON.stringify(message)}
                className={`message-container ${alignMessage(message)}`}>
                <span className='chatUser'>{`${message.username}: `}</span>
                <span className='chatMessage'>{message.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </StyledChatBox>
  );
}

const StyledChatBox = styled(Container)`
  border: 1px solid gray;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  height: 100%;
  overflow-y: scroll;
  width: 100%;
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
