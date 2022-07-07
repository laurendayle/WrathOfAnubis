import Container from '@mui/material/Container';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../socket/socket';
import { userState } from '../_states/tokenState';
import { useRecoilValue, useRecoilState } from 'recoil';
import Typography from '@mui/material/Typography';
import { friendsState } from '../_states/friendslist';
import axios from 'axios';

export default function ActiveUsersList() {
  const socket = useContext(SocketContext);
  const userData = useRecoilValue(userState);
  const [usersList, setUsersList] = useState([]);
  const [globalUsersList, setGlobalUsersList] = useRecoilState(friendsState);
  const [updatedUser, setUpdatedUser] = useRecoilState(userState);
  const [friendsList, setFriendsList] = useState([]);
  const avatars = [
    '/_next/static/media/icon3.9872b9c5.png',
    '/_next/static/media/icon2.37800c5f.png',
    '/_next/static/media/icon3.9872b9c5.png',
    '/_next/static/media/icon4.e31317e0.png',
    '/_next/static/media/icon5.173d920f.png',
  ];

  useEffect(() => {
    socket.on('receive-lobby', (users) => {
      setUsersList(users);
      setGlobalUsersList(users);
    });
    socket.on('error', (err) => {
      console.error(err);
    });
  });

  useEffect(() => {
    socket.emit('join-room', userData, 'lobby');
  }, [userData.userToken]);

  const friendAdd = (friendId) => {
    console.log(friendId);
    axios
      .put(
        `${process.env.REACT_APP_URL}/blueocean/api/v1/users/togglefriend`,
        { user_id: friendId },
        {
          headers: {
            Authorization: `Bearer ${userData.userToken}`,
          },
        }
      )
      .then((res) => {
        const localUser = JSON.parse(localStorage.getItem('userToken'));
        localUser.friends = res.data.friends;
        localStorage.setItem('userToken', JSON.stringify(localUser));
        const copyUser = { ...userData };
        copyUser.friends = res.data.friends;
        setUpdatedUser(copyUser);
      });
  };

  useEffect(() => {
    const data = userData.friends.map((friend) => {
      return friend.userName;
    });
    setFriendsList(data);
  }, [userData.userToken, userData.friends]);

  return (
    <div id='activeUsers-outerContainer'>
      <Title id='activeUsers-header'>ONLINE PLAYERS</Title>
      <Container disableGutters={true} maxWidth={false} id='activeUsers-container'>
        {!usersList.length ? (
          <div style={{ textAlign: 'center', marginTop: '5px' }}>No active users</div>
        ) : (
          usersList.map((user, i) => (
            <div key={JSON.stringify(user)} className='activeUser-item'>
              <div id='activeUsersList-container'>
                <div className='activeUsers-username'>
                  <img
                    className='userAvatar'
                    src={!user.img || user.img === '' ? avatars[i % 5] : user.img}
                    height={'33'}
                    width={'33'}
                  />
                  {/* <img className='userAvatar' src={!user.img || user.img === "" ? avatars[Math.floor(Math.random() * 5) + 1] : user.img } height={"33"} width={"33"} /> */}

                  <span className='userName'>{user.userName}</span>
                  {user.userName.split('_')[0] !== 'Guest' &&
                  userData.userToken &&
                  userData.userName !== user.userName &&
                  !friendsList.includes(user.userName.split('_')[0]) ? (
                    <Button onClick={() => friendAdd(user.userId)}>+</Button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Container>
    </div>
  );
}

const Button = styled.h1`
  &:hover {
    color: red;
    cursor: pointer;
  }
`;

const Title = styled(Typography)`
  font-family: 'Josefin Slab';
  text-align: center;
  letter-spacing: 0.1rem;
  padding-top: 6px;
  font-weight: 700;
  color: #f1f7ed;
  font-weight: 700;
  letter-spacing: 0.2rem;
  line-height: 1.6;
  padding-top: 5px;
  font-size: 1.1rem;
`;
