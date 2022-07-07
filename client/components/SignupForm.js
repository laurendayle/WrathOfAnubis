import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Box from '@mui/material/Box';
import { userState } from '../_states/tokenState';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Icon1 from '../public/icons2/icon1.png';
import Icon2 from '../public/icons2/icon2.png';
import Icon3 from '../public/icons2/icon3.png';
import Icon4 from '../public/icons2/icon4.png';
import Image from 'next/Image';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F1F7ED',
  border: '1px solid gray',
  boxShadow: 24,
  p: 4,
  borderRadius: '5px',
  textAlign: 'center',
};

export default function SignupForm(props) {
  const router = useRouter();

  useEffect(() => {
    if (submitted) {
      router.push('/lobby');
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useRecoilState(userState);
  const [img, setImg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    data['img'] = img;

    axios({
      method: 'post',
      url: `http://${process.env.REACT_APP_URL}/blueocean/api/v1/users`,
      data: data,
    })
      .then((res) => {
        if (res.status === 200) {
          setToken({
            userId: res.data.user._id,
            userToken: res.data.token,
            userName: res.data.user.userName,
            img: res.data.user.img,
            score: 0,
          });
          setSubmitted(true);
          localStorage.setItem(
            'userToken',
            JSON.stringify({
              userId: res.data.user._id,
              userToken: res.data.token,
              userName: res.data.user.userName,
              img: res.data.user.img,
              score: 0,
            })
          );
        }
      })
      .catch((err) => console.log('ERR IN SIGN UP'));
  };

  return (
    <>
      <Box sx={style}>
        <h3 style={{ color: '#9A8249' }}>SIGN UP</h3>
        <form id='signup-container' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            placeholder='Username'
            {...register('userName', { required: true, minLength: 5 })}
          />
          {errors.userName && (
            <div className='formValidation-error'>
              Username must contain more than 5 alphanumeric characters
            </div>
          )}
          <TextField
            placeholder='Password'
            type='password'
            {...register('password', { required: true })}
          />
          {errors.password && (
            <div className='formValidation-error'>
              Enter a valid password with:{' '}
              <ul>
                <li>At least 2 uppercase letters</li>
                <li>At least 1 number</li>
                <li>At least one special character</li>
              </ul>{' '}
            </div>
          )}
          <TextField
            placeholder='Email'
            {...register('email', {
              required: true,
              pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            })}
          />
          {errors.email && <div className='formValidation-error'>Enter a valid email</div>}
          <Container id='images-container'>
            <span id='signup-title'>Choose an Avatar:</span>

            <ImageContainer onClick={(e) => setImg(Icon1.src)} className='avatar-container'>
              <StyledImage
                style={{ paddingRight: '3px' }}
                height='40'
                width='35'
                src={Icon1.src}
                name={'Icon1'}
              />
            </ImageContainer>

            <ImageContainer
              name={'2'}
              className='avatar-container'
              onClick={(e) => setImg(Icon2.src)}>
              <StyledImage name={'2'} src={Icon2.src} height='37' width='35' />
            </ImageContainer>

            <ImageContainer
              className='avatar-container'
              style={{ paddingTop: '5px', paddingLeft: '3px' }}
              onClick={(e) => setImg(Icon3.src)}>
              <StyledImage src={Icon3.src} name={'Icon1'} height='35' width='35' />
            </ImageContainer>

            <ImageContainer className='avatar-container' onClick={(e) => setImg(Icon4.src)}>
              <StyledImage src={Icon4.src} height='37' width='33' />
            </ImageContainer>
          </Container>

          <Button
            type='submit'
            size='medium'
            sx={{ color: '#9A8249', border: '1px solid #9a824991' }}>
            Create Account
          </Button>
        </form>
      </Box>
    </>
  );
}

const StyledContainer = styled(Container)`
  border: 1px solid gray;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const StyledImage = styled.img`
  border-radius: 99px;
  height: 100%;
  width: 100%;
`;

const ImageContainer = styled.div`
  background-color: lightgray;
  width: 60px;
  height: 40px;
  border-radius: 99px;
  text-align: center;
  margin: 3px 5px 3px 5px;
  text-align: center;
  &:hover {
    border: 1px solid #9a8249;
  }
`;
