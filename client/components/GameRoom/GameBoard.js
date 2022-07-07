import Container from '@mui/material/Container';
import styled from 'styled-components';
import Popover from '@mui/material/Popover';
import Image from 'next/Image';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useContext } from 'react';
import BoardImg from '../../public/gameboard.jpg';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Sprite1 from '../../public/sprite1.png';
import { useRouter } from 'next/router';
import { SocketContext } from '../../socket/socket';
import Sprite2 from '../../public/sprite2.png';
import Sprite3 from '../../public/sprite3.png';
import Sprite4 from '../../public/sprite4.png';
import { MapEmAcross, MapEmCircle, oneInMiddle } from './HelperFuncs.js';
import uuid from 'react-uuid';
const sprites = [Sprite1.src, Sprite2.src, Sprite3.src, Sprite4.src];
const sprite = { height: '60px', width: '30px' };
export default function GameBoard(props) {
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popName, setPopName] = useState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopName();
  };
  const getSpriteIndex = (userName) => {
    if (userName.slice(0, 3) === 'bot') {
      return parseInt(userName.slice(3)) % 4;
    } else {
      return userName.length % 4;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const { gameId, playerId } = router.query;
  const user = props.user;
  const socket = useContext(SocketContext);
  const players = props.game.players.filter((player) => player.status === true);
  const game = props.game;
  const [trialVote, setTrialVote] = useState();
  const vote = (candidate) => {
    let user1 = { user_id: user.userId, userName: user.userName };
    setTrialVote(false);
    let cand = { player: game.playerVoted };
    socket.emit('player-vote', user1, cand, gameId);
  };

  useEffect(() => {
    setTrialVote(true);
  }, [game.currentRound]);

  useEffect(() => {
    setHeight(document.getElementById('bgimg').clientHeight);
    setWidth(document.getElementById('bgimg').clientWidth);
  });
  const renderItems = (game) => {
    var phase = game.phase || 'night';
    var Arr;
    if (phase === 'day2') {
      Arr = MapEmAcross(players, 75, 60, height, width);
    } else if (phase === 'day3') {
      //setTrialVote(true)
      let userName = game.playerVoted.userName;
      Arr = oneInMiddle(players, 75, 60, height, width, userName);
    } else {
      Arr = MapEmCircle(players, 75, 60, height, width);
    }
    return Object.values(Arr).map((locale, i) => {
      // /console.log(Arr)
      return (
        <Tooltip key={uuid()} title={locale.userName}>
          <Person id={locale.userName} onClick={handleClick} left={locale.left} top={locale.top}>
            <Image src={sprites[getSpriteIndex(locale.userName)]} alt='' height='75' width='60' />
          </Person>
        </Tooltip>
      );
    });
  };

  // return Object.values(Arr).map((locale, i) => {
  //   return (
  //     <Tooltip title={players[i].player.userName}>
  //       <Person left={locale.left} top={locale.top}>
  //         <Image src={sprites[i % 4]} alt='' height='70' width='40' />
  //       </Person>
  //     </Tooltip>
  //   );
  // });
  // };
  const open = Boolean(anchorEl);
  return (
    <OuterContainer maxWidth={false} disableGutters={true}>
      <Banner>
        {props.announcement ? (
          <Announcement behavior='scroll' direction='left'>
            {props.announcement}
          </Announcement>
        ) : null}
      </Banner>
      <ImgContainer maxWidth={false} disableGutters={true}>
        <Img src={BoardImg} alt='' id='bgimg' height='450' width='850' />
        {props.game ? renderItems(game) : null}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}>
          {anchorEl ? <h3>{anchorEl.id} Vote History:</h3> : null}
          {anchorEl
            ? Object.keys(game.players1[anchorEl.id].voteHistory).map((key, ind, array) => {
                //return <h5>{key}</h5>
                if (game.players1[anchorEl.id].voteHistory[key] !== null) {
                  console.log(array[key]);
                  return (
                    <h5>
                      Round {key}: voted to eliminate{' '}
                      {game.players1[anchorEl.id].voteHistory[key].onTrial}
                    </h5>
                  );
                }
              })
            : null}
        </Popover>
        {props.game.phase === 'day3' && trialVote && props.info.status ? (
          <Phase3 onClick={vote}>VOTE TO SACRIFICE {game.playerVoted.userName}</Phase3>
        ) : (
          <></>
        )}
      </ImgContainer>
    </OuterContainer>
  );
}

const Person = styled.span`
  position: absolute;
  border-radius: 15px;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
`;

const OuterContainer = styled(Container)`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  background-color: #f1f7ed;
  border-radius: 5px;
  height: 400px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  padding: 10px;
  height: 70%;
  margin-top: 10px;
  text-align: center;
  min-width: 750px;
  margin-bottom: 0;
`;

const ImgContainer = styled(Container)`
  position: relative;
  border-radius: 5px;
  margin-left: 0;
`;

const Banner = styled.div`
  width: 100%;
  height: 35px;
  background-color: #9a8249;
  border-radius: 5px 5px 0 0;
`;

const Img = styled(Image)`
  border-radius: 0 0 5px 5px;
  height: 80%;
`;

const Announcement = styled.marquee`
  font-size: 1.5em;
  line-height: 1.6em;
  font-family: 'Josefin Slab';
  font-weight: 700;
  color: white;
`;
const VoteHistory = styled.span`
  position: absolute;
  left: 500px;
  top: 50px;
`;

const Phase3 = styled.button`
  border: none;
  background-color: #9a824991;
  cursor: pointer;
  height: 30px;
  border-radius: 9px;
  padding: 7px;
  width: fit-content;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  font-family: 'Josefin Slab';
  font-weight: 700;
  font-size: 1.1em;
`;
