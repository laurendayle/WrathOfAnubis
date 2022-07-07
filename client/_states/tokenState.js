const { atom, selector } = require('recoil');
const uuid = require('react-uuid');

const userState = atom({
  key: 'tokenState',
  default: {
    userId: '',
    userToken: '',
    userName: `Guest_${uuid().slice(0, 5)}`,
    img: '',
    score: 0,
    friends: []
  },
});

const userTokenState = selector({
  key: 'userTokenState',
  get: ({ get }) => {
    const token = get(userState.token);
    return token;
  },
});

export { userState, userTokenState };
