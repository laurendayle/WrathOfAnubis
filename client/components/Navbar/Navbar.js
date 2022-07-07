import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import FriendsModalForm from '../Modal/FriendsModalForm';
import Skeleton from '@mui/material/Skeleton';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';
import { userState } from '../../_states/tokenState';
import { useRecoilState, useRecoilValue } from 'recoil';
import LogoIcon from '../../public/anubis-bg.jpg';
import Image from 'next/Image';
import { useRouter } from 'next/router';
import uuid from 'react-uuid';
import axios from 'axios';
import { friendsState } from '../../_states/friendslist';
import { SocketContext } from '../../socket/socket';
const Navbar = () => {
  const [userData, setUserData] = useRecoilState(userState);
  const allUsers = useRecoilValue(userState);
  const onlinePlayers = useRecoilValue(friendsState);
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [friendId, setFriendId] = useState('');
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('userToken'));
    if (userData.userToken || localUser) {
      setLoggedIn(true);
    }
  }, []);

  const loginClicked = () => {
    handleLoginModal();
  };

  const signupClicked = () => {
    handleSignupModal();
  };

  const logoutFunc = () => {
    localStorage.removeItem('userToken');
    setUserData({
      userId: '',
      userToken: '',
      userName: `Guest_${uuid().slice(0, 5)}`,
      img: '',
      score: 0,
      friends: [],
    });
    setLoggedIn(false);
    router.push('/');
  };

  const backToLobby = () => {
    router.push('/lobby');
  };

  //navbar page states based on if user is logged in
  const pagesIfLoggedIn = [
    ,
    ,
    <StyledLinks onClick={backToLobby}>Lobby</StyledLinks>,
    <StyledLinks onClick={logoutFunc}>Logout</StyledLinks>,
  ];
  //const pagesIfLoggedIn = [, 'Ranking', <Link href='/'>Logout</Link>];
  const pagesIfNotLoggedIn = [
    ,
    <StyledLinks onClick={signupClicked}>Sign Up</StyledLinks>,
    <StyledLinks onClick={loginClicked}>Login</StyledLinks>,
  ];
  //handles hamburger menu
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  //modal states
  const [open, setOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [friendsList, setFriendsList] = useState([]);

  const handleLoginModal = () => {
    setLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModal(false);
  };

  const handleSignupModal = () => {
    setSignupModal(true);
  };

  const handleCloseSignupModal = () => {
    setSignupModal(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //handling friends states
  //green dot does not appear if invisible is true
  const [invisible, setInvisible] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [friendLoggedIn, setFriendLoggedIn] = useState(false);
  const [state, setState] = useState({
    left: false,
  });
  //toggle skeleton
  const [loading, setLoading] = useState(false);
  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('userToken'));
    //console.log('localstorage user', localUser);
    if (localUser) {
      setUserData(localUser);
    }
  }, []);

  //console.log('recoilstate', userData);

  //use effect for getting friend list
  // useEffect(() => {
  //   const localUser = JSON.parse(localStorage.getItem('userToken'));
  //   if (localUser) {
  //     const url = `http://${process.env.REACT_APP_URL}/blueocean/api/v1/users/friend`;
  //     axios({
  //       method: 'GET',
  //       url,
  //       headers: {
  //         Authorization: `Bearer ${localUser.userToken}`,
  //       },
  //       user_id: localUser.userId,
  //     })
  //       .then((res) => {
  //         setFriendsList([res.data.user.friends]);
  //       })
  //       .catch((err) => console.log('error friend response', err));
  //   }
  // }, []);

  const filteredByOnline = (friends, online) => {
    if (typeof friends === 'undefined') return [];
    let obj = {};
    //console.log('hereee', friends, online)
    for (let i = 0; i < friends.length; i++) {
      const friend = { ...friends[i] };
      let friendName = friend.userName;
      friend.loggedIn = false;
      obj[friendName] = friend;
      //console.log(obj);
    }
    for (let i = 0; i < online.length; i++) {
      let onlineName = online[i].userName;
      if (obj[onlineName]) {
        obj[onlineName].loggedIn = true;
      }
    }
    return Object.values(obj);
  };

  const list = (anchor) => (
    <Box
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      {/* //toggle skeleton */}
      {loading && (
        <List>
          {[...Array(20)].map((text) => {
            return (
              <div key={uuidv4()}>
                <ListItem>
                  <ListItemIcon>
                    <Skeleton animation='wave' height={40} width={40} variant='circular' />
                    <Skeleton
                      style={{ marginLeft: '15px', marginTop: '12px' }}
                      animation='wave'
                      width={40}
                      height={20}
                      variant='rectangular'
                    />
                  </ListItemIcon>
                </ListItem>
                <Divider light />
              </div>
            );
          })}
        </List>
      )}

      {!loading && (
        <List>
          {/* array of friends for specific user */}
          {filteredByOnline(allUsers.friends, onlinePlayers).map((friend) => (
            <div key={uuidv4()}>
              <ListItem>
                <ListItemIcon>
                  {/* if user.loggedIn is true, show green, else show invisible */}
                  {friend.loggedIn ? (
                    <Badge overlap='circular' variant='dot' color='success'>
                      <IconButton size='small' onClick={(e) => avatarClick(e, friend._id)}>
                        <Avatar />
                      </IconButton>
                    </Badge>
                  ) : (
                    <IconButton size='small' onClick={avatarClick}>
                      <Avatar />
                    </IconButton>
                  )}
                </ListItemIcon>
                <ListItemText primary={friend.userName} />
              </ListItem>
              <Divider light />
            </div>
          ))}
        </List>
      )}
    </Box>
  );

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const friendsClicked = () => {
    handleCloseNavMenu();
    toggleDrawer('right', true)();
  };

  //make it so modal appears to either send message or delete friend
  const avatarClick = (e, id) => {
    e.stopPropagation();
    setFriendId(id);
    handleOpen();
  };

  const closeAfterDeleteFriend = () => {
    handleClose();
  };
  return (
    <>
      <AppBar position='static' style={{ backgroundColor: 'black' }}>
        <Container maxWidth='xl' style={{ backgroundColor: 'black' }}>
          <Toolbar style={{ backgroundColor: 'black' }}>
            <Link href='/'>
              <Image height='60' width='65' src={LogoIcon} alt='' />
            </Link>
            <Typography
              variant='h6'
              noWrap
              component='a'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: '#d4af37',
                textDecoration: 'none',
              }}>
              WRATH OF ANUBIS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'>
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}>
                {/* if user.loggedIn is true, show green, else show invisible */}
                {loggedIn && (
                  <MenuItem style={{ color: '#d4af37' }} onClick={friendsClicked} key='friends'>
                    Friends
                  </MenuItem>
                )}
                {loggedIn
                  ? pagesIfLoggedIn.map((page) => (
                      <MenuItem key={uuidv4()} onClick={handleCloseNavMenu}>
                        {page}
                      </MenuItem>
                    ))
                  : pagesIfNotLoggedIn.map((page) => (
                      <MenuItem key={uuidv4()} onClick={handleCloseNavMenu}>
                        {page}
                      </MenuItem>
                    ))}
              </Menu>
            </Box>
            <Typography
              variant='h5'
              noWrap
              component='a'
              href=''
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: '#d4af37',
                textDecoration: 'none',
              }}>
              WRATH OF ANUBIS
            </Typography>
            <Box
              sx={{
                marginRight: '2em',
                justifyContent: 'flex-end',
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
              }}>
              {loggedIn && (
                <MenuItem onClick={friendsClicked} sx={{ color: '#d4af37' }} key='friends'>
                  Friends
                </MenuItem>
              )}
              {loggedIn
                ? pagesIfLoggedIn.slice(1).map((page) => (
                    <MenuItem key={uuidv4()} onClick={handleCloseNavMenu}>
                      {page}
                    </MenuItem>
                  ))
                : pagesIfNotLoggedIn.slice(1).map((page) => (
                    <MenuItem key={uuidv4()} onClick={handleCloseNavMenu}>
                      {page}
                    </MenuItem>
                  ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <IconButton sx={{ p: 0 }}>
                {loggedIn && <Avatar alt='Remy Sharp' src={userData.img} />}
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}></Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <>
        <Drawer anchor={'right'} open={state['right']} onClose={toggleDrawer('right', false)}>
          {list('right')}
        </Drawer>
      </>
      {/* friends modal */}
      <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'>
          <FriendsModalForm friendId={friendId} closeAfterDeleteFriend={closeAfterDeleteFriend} />
        </Modal>
      </>
      {/* signup modal */}
      <>
        <Modal
          open={signupModal}
          onClose={handleCloseSignupModal}
          aria-labelledby='modal-modal-signup'
          aria-describedby='modal-modal-description'>
          <SignupForm />
        </Modal>
      </>
      {/* login modal */}
      <>
        <Modal
          open={loginModal}
          onClose={handleCloseLoginModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'>
          <LoginForm />
        </Modal>
      </>
    </>
  );
};
export default Navbar;

const StyledLinks = styled.div`
  color: #d4af37;
`;
