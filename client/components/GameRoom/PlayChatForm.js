import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../../socket/socket';
import { useRecoilValue } from 'recoil';
import { userState } from '../../_states/tokenState';
import Input from '@mui/material/Input';
import { shadows } from '@mui/system';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { useRouter } from 'next/router';

export default function PlayChat() {
  const [chat, setChat] = useState('');
  const user = useRecoilValue(userState);
  const socket = useContext(SocketContext);

  const chatBoxOnChange = (e) => {
    setChat(e.target.value);
  };
  const router = useRouter();
  const { gameId, playerId } = router.query;

  const onFormSubmit = (e) => {
    e.preventDefault();
    let user1 = { user_id: user.userId, userName: user.userName };
    let message = chat;
    socket.emit('send-message', user1, message, gameId);
    setChat('');
  };

  return (
    <Form onSubmit={onFormSubmit}>
      <ChatInput
        type='text'
        placeholder='Send Message'
        onChange={chatBoxOnChange}
        value={chat}
        id='chat-input'
      />
      <StyledButton
        style={{ color: '#9A8249' }}
        id='submitChat-button'
        endIcon={<SendIcon />}
        type='submit'
      />
    </Form>
  );
}

const Form = styled.form`
  background-color: #f1f7ed;
  border: 1px solid gray;
  border-radius: 0 0 5px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
  margin-bottom: 10px;
  min-width: 250px;
  max-width: 300px;
`;

const ChatInput = styled.input`
  border: none;
  border-radius: 30px;
  background-color: rgba(128, 128, 128, 0.112);
  width: 85%;
  margin: 0;
  padding: 13px;
  height: 35px;
  margin-left: 5px;
`;

const StyledButton = styled(Button)`
  height: 45px;
  width: 5%;
  background-color: transparent;
  color: #9a824991;
  box-shadow: none;
`;
