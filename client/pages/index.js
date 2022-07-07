import LandingPage from '../components/LandingPage';
import Container from '@mui/material/Container';
import Navbar from '../components/Navbar/Navbar';
import React, { useState, useEffect, useContext } from 'react';
import ActiveUsersList from '../components/ActiveUsersList';
import axios from 'axios';
import GameInstructions from '../components/GameInstructions';
import styled from 'styled-components';
import { SocketContext } from '../socket/socket';
const basePath = `${process.env.REACT_APP_URL}/blueocean/api/v1`;

export default function Home() {
  const socket = useContext(SocketContext);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeList, setActiveList] = useState([]);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (error) {
    return <div>Error: {error.message} </div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <Navbar />
        <Container maxWidth={false} id='app-container'>
          {socket && <ActiveUsersList />}

          <Container maxWidth={false} disableGutters={true} id='video-instructions-container'>
            <Container maxWidth={false} disableGutters={true} id='video-container'>
              <div id='video-header'>WELCOME TO WRATH OF ANUBIS</div>
              <iframe
                id='video-element'
                src='https://www.youtube.com/embed/OysJ4nL4jS8'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen></iframe>
            </Container>
            <Container maxWidth={false} id='instructions-container'>
              <Header id='instructions-header'>HOW TO PLAY</Header>
              <div id='instructions-text' style={{ fontSize: '0.85em' }}>
                <div>
                  <ol>
                    <li>
                      {' '}
                      Each player will be randomly assigned one of the following roles: Anubis,
                      Seer, Doctor, Villager{' '}
                    </li>
                    <li>
                      Each night, the players assigned the role of Anubis will vote to mummify one
                      player.
                    </li>
                    <li>
                      Each day, the non-mummified players can chat to attempt to determine who is
                      Anubis.
                    </li>
                    <li>
                      Once the votes are tallied, the chosen player will be sacrified to their gods.
                    </li>
                    <li>The final remaining player wins.</li>
                  </ol>
                </div>
                <div style={{ display: 'flex', textAlign: 'center' }}>
                  <RolesDiv>
                    <span>Doctor</span>
                    <div>
                      Doctors have the special ability to reverse the mummification for one player
                      should that player be chosen by Anubis for sacrifice. To heal a player, the
                      Doctor must click the "Heal" button displayed on the player's card they wish
                      to heal.
                    </div>
                  </RolesDiv>
                  <RolesDiv>
                    <div>Seer</div>
                    <div>
                      Seers can choose to reveal the identity of one player by clicking the "Reveal"
                      button displayed on the player's card they wish to unveil.
                    </div>
                  </RolesDiv>
                </div>
              </div>
            </Container>
          </Container>
        </Container>
      </>
    );
  }
}

const RolesDiv = styled.div`
  width: 250px;
  height: fit-content;
`;

const Header = styled.div`
  background-color: #9a8249;
  border-radius: 5px 5px 0 0;
  height: 35px;
  font-family: 'Josefin Slab';
  text-align: center;
  color: #f1f7ed;
  font-weight: 700;
  letter-spacing: 0.2rem;
  line-height: 1.6;
  padding-top: 2px;
  font-size: 1.25rem;
  position: relative;
  top: -5px;
  width: 100%;
`;
