const { atom } = require('recoil');

const friendsState = atom({
  key: 'friends',
  default: [],
});

export { friendsState };
