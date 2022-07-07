import React from 'react';
import styled from 'styled-components';
import List from '@mui/material/List';
export default function LobbyDisplay() {
  return (
    <StyledList>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
      <p>Some player</p>
    </StyledList>
  );
}

const StyledList = styled(List)`
  border: 1px solid black;
  margin-top: 1em;
  min-width: 100%;
  height: 90vh;
  overflow: auto;
  padding: 7px;
`;
