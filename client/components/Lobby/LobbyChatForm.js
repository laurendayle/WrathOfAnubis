import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../../socket/socket';
import { useRecoilState } from 'recoil';
import { userState } from '../../_states/tokenState';
import Input from '@mui/material/Input';
import { shadows } from '@mui/system';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

export default function ChatForm() {
  //VARIABLES TO MAKE SOCKET WORK
  const socket = useContext(SocketContext);
  const [chatBoxInput, setChatBoxInput] = useState('');

  const [user, setUser] = useRecoilState(userState);

  const chatBoxOnChange = (e) => {
    setChatBoxInput(e.target.value);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    let message = {
      text: chatBoxInput,
      time: Date.now(),
      username: user.userName,
    };
    socket.emit('send-message', user, message, 'lobby');
    setChatBoxInput('');
  };

  return (
    <Form onSubmit={onFormSubmit}>
      <ChatInput
        type='text'
        placeholder='Send Message'
        onChange={chatBoxOnChange}
        value={chatBoxInput}
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
  height: 55px;
  margin-bottom: 15px;
`;

const ChatInput = styled.input`
  border: none;
  border-radius: 30px;
  background-color: rgba(128, 128, 128, 0.112);
  width: 85%;
  margin: 0;
  padding: 13px;
  height: 40px;
`;

const StyledButton = styled(Button)`
  height: 45px;
  width: 5%;
  background-color: transparent;
  color: #9a824991;
  box-shadow: none;
`;
