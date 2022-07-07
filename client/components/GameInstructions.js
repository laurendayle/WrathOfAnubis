import React, { useState } from 'react';
import styled from 'styled-components';
import { shadows } from '@mui/system';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function GameInstructions (props) {
  const game = props.game
  const info = props.info


  return (
    <StyledContainer>
      <StyledCard>
      <h3 style={{textAlign: 'center'}}>Instructions</h3>
        <div>
          <ol>
            <li>Each player will be randomly assigned one of the following roles: Anubis, Seer, Doctor, Villager </li>
            <li>Each night, the players assigned the role of Anubis will vote to mummify one player.</li>
            <li>Each day, the non-mummified players can chat to attempt to determine who is Anubis.</li>
            <li>Once the votes are tallied, the chosen player will be sacrified to their gods.</li>
            <li>The final remaining player wins.</li>
          </ol>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <RolesDiv>
          <div style={{textAlign: 'center'}}>Doctor</div>
          <div>Doctors have the special ability to reverse the mummification for one player should that player be chosen by Anubis for sacrifice. To heal a player, the Doctor must click the "Heal" button displayed on the player's card they wish to heal.</div>
        </RolesDiv>

        <RolesDiv>
          <div style={{textAlign: 'center'}}>Seer</div>
          <div>Seers can choose to reveal the identity of one player by clicking the "Reveal" button displayed on the player's card they wish to unveil.</div>
        </RolesDiv>
          </div>
        <Button onClick={props.close}>X</Button>

      </StyledCard>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  /* text-align: center; */
  width: 100%;
`;

const StyledCard = styled(Card)`
  background-color: #F1F7ED;
  margin: 5px;
  padding: 5px;
  width: 50%;
`;

const GameInfoCard = styled(Card)`
  height: fit-content;
  margin: 5px;
  padding: 5px;
  width: 350px;
`;

const Button = styled.button`
  align-self: flex-start;
  background-color: #9a824991;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  float: right;
  height: fit-content;
  margin: 5px;
  position: relative;
  width: fit-content;
`;

const RolesDiv = styled.div`
  width: 250px;
  height: 250px;
  margin: 10px;
`;