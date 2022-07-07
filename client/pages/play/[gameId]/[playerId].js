import Container from '@mui/material/Container';
import React, { useState, useEffect, useContext } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid';
import Navbar from '../../../components/Navbar/Navbar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import styled from 'styled-components';
import axios from 'axios';
import GameInfo from '../../../components/GameInfo';
import { SocketContext } from '../../../socket/socket';
import { getGameInfo } from '../../../components/GameRoom/funcs.js';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import GameInstructions from '../../../components/GameInstructions.js';
import PlayChat from '../../../components/GameRoom/PlayChatForm';
import PlayChatRoom from '../../../components/GameRoom/PlayChatRoom';
import PlayerCard from '../../../components/PlayerCard.js';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/solid';
import { userState } from '../../../_states/tokenState';
import GameBoard from '../../../components/GameRoom/GameBoard';

import { useRecoilValue } from 'recoil';
const basePath = 'localhost:4030/blueocean/api/v1';

export default function Game() {
  const basePath = `${process.env.REACT_APP_URL}/blueocean/api/v1`;
  const [players, setPlayers] = useState([]);
  const [owner, setOwner] = useState();
  const [announcement, setAnnouncement] = useState([]);
  const [role, setRole] = useState('wolf');
  const [phase, setPhase] = useState('night');
  const [card, setCard] = useState(0);
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState(false);
  const [game, setGame] = useState();
  const [gameInfo, setGameInfo] = useState();
  const [messages, setMessages] = useState([]);
  const user = useRecoilValue(userState);
  const socket = useContext(SocketContext);
  const router = useRouter();
  const { gameId, playerId } = router.query;
  var started = false;

  const markAsVoted = () => {
    setVoted(true);
  };

  useEffect(() => {
    socket.on(`game-send`, (game) => {
      setGame(game);
      setVoted(false);
      setGameInfo(getGameInfo(game, playerId));
    });
    socket.on(`receive-message-${gameId}`, (user, message) => {
      let messageObj = { userName: user.userName, text: message, user_id: user.user_id };
      if (user.user_id === 'announcement') {
        setAnnouncement(message);
      } else {
        setMessages([...messages, messageObj]);
      }
    });
  });

  useEffect(() => {
    socket.emit('join-room', { user_id: playerId, userName: user.userName }, gameId);
  }, [user.userToken]);
  useEffect(() => {
    if (game) {
      const container = document.querySelector('.playerCardContainer');
      container.style.transitionDuration = '.8s';
      container.style.transform = `translate( -${card * 150}px)`;
    }
  }, [card]);

  useEffect(() => {
    if (gameId) {
      axios({
        method: 'get',
        url: `http://${basePath}/games/single?`,
        params: { id: gameId },
      })
        .then((res) => {
          let data = res.data;
          setGame(data.game);
          setGameInfo(getGameInfo(data.game, playerId));
        })
        .catch((err) => err);
    }
  }, [gameId]);

  const closeDrawer = () => {
    setOpen(false);
  };

  const startGame = () => {
    var player1 = { user_id: playerId, userName: user.userName };
    socket.emit('start-game', player1, gameId);
  };
  const switchPhase = () => {
    phase === 'night' ? setPhase('day') : setPhase('night');
  };
  const moveRight = () => {
    if (card < game.players.length - 2) {
      let current = card;
      setCard(current + 2);
    } else {
      let current = card;
      setCard(players.length - 2);
    }
  };
  const moveLeft = () => {
    if (Card > 2) {
      let current = card;
      setCard(current - 2);
    } else {
      let current = card;
      setCard(0);
    }
  };

  return (
    <>
      <Navbar />
      <Container sx={{ minWidth: '1100px', maxWidth: '1500px' }}>
        <Container sx={{ float: 'left', width: '25%' }}>
          <PlayChatRoom messages={messages} />
          <PlayChat />
        </Container>
        {game ? (
          <Box sx={{ display: 'inline-block', float: 'right', width: '75%' }}>
            <Container maxWidth={false} id='gameBoard-container'>
              <Drawer open={open} className='gameInfoDrawer' variant='persistent' anchor='top'>
                <div>
                  <GameInstructions close={closeDrawer} info={gameInfo} game={game} />
                </div>
              </Drawer>

              <GameBoard
                announcement={announcement}
                info={gameInfo}
                setOpen={setOpen}
                open={open}
                startGame={startGame}
                playerId={playerId}
                game={game}
                user={user}
              />
            </Container>
            <Container maxWidth={false} id='playerCards-container'>
              <GameInfo
                announcement={announcement}
                info={gameInfo}
                setOpen={setOpen}
                open={open}
                startGame={startGame}
                playerId={playerId}
                game={game}
              />

              <StyledButton onClick={moveLeft}>
                <ChevronLeftIcon stroke='#F1F7ED' fill='#F1F7ED' height='35' />
              </StyledButton>

              <div className='viewport'>
                <div disableGutters={true} maxWidth={false} className='playerCardContainer'>
                  <Stack direction='row' spacing={0}>
                    {game.players ? (
                      game.players.map((player) => {
                        if (player.player.user_id !== playerId) {
                          return (
                            <PlayerCard
                              key={player.player.userName}
                              phase={gameInfo.phase}
                              role={gameInfo.role}
                              status={gameInfo.status}
                              player={player}
                              voted={voted}
                              markAsVoted={markAsVoted}
                            />
                          );
                        }
                      })
                    ) : (
                      <p>Loading</p>
                    )}
                  </Stack>
                </div>
              </div>

              <StyledButton onClick={moveRight}>
                <ChevronRightIcon stroke='#F1F7ED' fill='#F1F7ED' height='35' />
              </StyledButton>
            </Container>
          </Box>
        ) : (
          <StyledContainer maxWidth='sm'>
            <p>Error: No games found. Try again.</p>
          </StyledContainer>
        )}
      </Container>
    </>
  );
}

const StyledPlayChat = styled(List)`
  border: 1px solid black;
  margin-top: 1em;
  min-width: 100%;
  height: 60vh;
  overflow: auto;
  padding: 7px;
`;

const StyledButton = styled.button`
  border: none;
  background-color: transparent;
  height: 20px;
  width: 20px;
  margin-left: 10px;
  margin-right: 15px;
  cursor: pointer;
`;

const StyledAlert = styled(Alert)`
  width: fit-content;
  background-color: #9a8249;
  color: #f1f7ed;
  display: inline;
`;

const StyledContainer = styled(Container)`
  background-color: #f1f7ed;
  width: fit-content;
  height: 150px;
  border-radius: 5px;
  text-align: center;
  padding-top: 40px;
  margin-top: 40px;
`;
