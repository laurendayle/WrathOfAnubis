import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../../_states/tokenState';
import Container from '@mui/material/Container';
export default function CreateGame({ handleChange }) {
  // /blueocean/api/v1/games
  //send token as header to so backend can get id from token
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState(0);
  const [gameName, setGameName] = useState('');
  const creator = useRecoilValue(userState);
  const nameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const numPlayers = (e) => {
    setPlayers(e.target.value);
  };

  const gameNameHandler = (e) => {
    setGameName(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const url = `${process.env.REACT_APP_URL}/blueocean/api/v1/games`;
    axios
      .post(
        url,
        { players, gameName },
        {
          headers: {
            Authorization: `Bearer ${creator.userToken}`,
          },
        }
      )
      .catch((err) => console.log(err));
    handleChange();
  };

  return (
    <StyledContainer maxWidth={false} disableGutters={true}>
      <Form onSubmit={onSubmitHandler}>
        <label>How many people are playing?</label>
        <FormInput onChange={numPlayers} type='number' />
        <label>What will the game name be?</label>
        <FormInput onChange={gameNameHandler} type='text' />
        <Button size='small' type='submit' variant='outlined' id='createGame-button'>
          <b>Create</b>
        </Button>
      </Form>
    </StyledContainer>
  );
}

const Form = styled.form`
  background-color: #f1f7ed;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  position: absolute;
  text-align: center;
  border: 1px solid gray;
  top: 12%;
  left: 45%;
  width: 300px;
  height: 250px;
  padding: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
`;

const FormInput = styled.input`
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border: none;
  background-color: rgba(211, 211, 211, 0.435);
  margin: auto;
  width: 50%;
  padding: 3px;
`;

const StyledContainer = styled(Container)`
  height: 350px;
  justify-content: center;
`;
