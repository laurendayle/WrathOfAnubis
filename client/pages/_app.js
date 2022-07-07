import { RecoilRoot } from 'recoil';
import '../styles/globals.css';
import CssBaseline from '@mui/material/CssBaseline';
import { SocketContext, socket } from '../socket/socket.js';
function MyApp({ Component, pageProps }) {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <RecoilRoot>
          <CssBaseline />
          <Component {...pageProps} />
        </RecoilRoot>
      </SocketContext.Provider>
    </>
  );
}

export default MyApp;
